import Stripe from "npm:stripe@12.12.0";
import * as kv from "./kv_store.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
};

const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY") || "";
const stripe = new Stripe(stripeSecret, {
  apiVersion: "2025-10-29.clover"
});

const json = (data, status = 200, extraHeaders = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
      ...extraHeaders
    }
  });

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    const url = new URL(req.url);
    const path = url.pathname;

    let body = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    if (path.endsWith("/places-autocomplete") && req.method === "POST") {
      const input = body.input;
      if (!input) {
        return json({ error: "Input required" }, 400);
      }

      const apiKey = Deno.env.get("GOOGLE_PLACES_API_KEY") || "";
      if (!apiKey) {
        console.error("GOOGLE_PLACES_API_KEY is missing");
        return json({ error: "Places API key missing" }, 500);
      }

      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            input
          )}&types=address&components=country:us&key=${apiKey}`
        );
        const data = await res.json();

        if (data.status && data.status !== "OK" && data.status !== "ZERO_RESULTS") {
          console.error("Places API error:", data);
          return json({ error: "Places API error", details: data }, 500);
        }

        return json({
          predictions: data.predictions || [],
          status: data.status || "OK"
        });
      } catch (err) {
        console.error("Places fetch failed:", err);
        return json({ error: "Failed to fetch Places API", details: err.message }, 500);
      }
    }

    if (path.endsWith("/create-payment-intent") && req.method === "POST") {
      const amount = body.amount;
      const address = body.address || "";
      
      if (!amount) {
        return json({ error: "Amount is required" }, 400);
      }

      if (!stripeSecret) {
        console.error("STRIPE_SECRET_KEY is missing");
        return json({ error: "Stripe secret key missing" }, 500);
      }

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100),
          currency: "usd",
          metadata: {
            address: address,
            service: "listing-analytics-premium",
          },
          automatic_payment_methods: { enabled: true },
        });

        return json({
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        });
      } catch (err) {
        console.error("Error creating payment intent:", err);
        return json({ error: "Failed to create payment intent", details: err.message }, 500);
      }
    }

    if (path.endsWith("/verify-payment") && req.method === "POST") {
      const paymentIntentId = body.paymentIntentId;
      
      if (!paymentIntentId) {
        return json({ error: "Payment intent ID is required" }, 400);
      }

      if (!stripeSecret) {
        console.error("STRIPE_SECRET_KEY is missing");
        return json({ error: "Stripe secret key missing" }, 500);
      }

      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === "succeeded") {
          const userId = paymentIntent.metadata.address || paymentIntentId;
          await kv.set(`subscription:${userId}`, {
            status: "active",
            paymentIntentId,
            createdAt: new Date().toISOString(),
            address: paymentIntent.metadata.address,
          });
          return json({ success: true, status: paymentIntent.status });
        }

        return json({ success: false, status: paymentIntent.status });
      } catch (err) {
        console.error("Error verifying payment:", err);
        return json({ error: "Failed to verify payment", details: err.message }, 500);
      }
    }

    if (path.endsWith("/check-subscription") && req.method === "POST") {
      const address = body.address;
      
      if (!address) {
        return json({ error: "Address is required" }, 400);
      }

      try {
        const subscription = await kv.get(`subscription:${address}`);
        return json({ hasSubscription: !!subscription, subscription });
      } catch (err) {
        console.error("Error checking subscription:", err);
        return json({ error: "Failed to check subscription", details: err.message }, 500);
      }
    }

    if (path.endsWith("/analyze-listing") && req.method === "POST") {
      const address = body.address;
      const placeId = body.placeId;
      if (!address) {
        return json({ error: "Address required" }, 400);
      }

      const geminiApiKey = Deno.env.get("GEMINI_API_KEY") || "";
      const rentCastApiKey = Deno.env.get("RENTCAST_API_KEY") || "";
      const placesApiKey = Deno.env.get("GOOGLE_PLACES_API_KEY") || "";
      
      if (!geminiApiKey) {
        console.error("GEMINI_API_KEY is missing");
        return json({ error: "Gemini API key missing" }, 500);
      }

      let propertyImageUrl = null;
      if (placeId && placesApiKey) {
        try {
          const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=photos&key=${placesApiKey}`;
          const placeDetailsRes = await fetch(placeDetailsUrl);
          
          if (placeDetailsRes.ok) {
            const placeDetails = await placeDetailsRes.json();
            if (placeDetails.result?.photos && placeDetails.result.photos.length > 0) {
              const photoReference = placeDetails.result.photos[0].photo_reference;
              propertyImageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${placesApiKey}`;
              console.log("Found property photo:", propertyImageUrl);
            }
          }
        } catch (photoError) {
          console.warn("Failed to fetch property photo (non-critical):", photoError.message);
        }
      }

      let listingData = {
        price: 0,
        beds: 0,
        baths: 0,
        sqft: 0,
        daysOnMarket: 0,
        propertyType: "Residential",
      };

      if (rentCastApiKey) {
        try {
          const rentCastUrl = `https://api.rentcast.io/v1/listings/sale?address=${encodeURIComponent(address)}&status=Active&limit=5`;
          console.log("Calling RentCast API:", rentCastUrl);
          
          const rentCastRes = await fetch(rentCastUrl, {
            method: "GET",
            headers: {
              "X-Api-Key": rentCastApiKey,
              "Content-Type": "application/json"
            }
          });

          if (rentCastRes.ok) {
            const rentCastResponse = await rentCastRes.json();
            console.log("RentCast API response:", JSON.stringify(rentCastResponse, null, 2));
            
            const rentCastData = Array.isArray(rentCastResponse) && rentCastResponse.length > 0 
              ? rentCastResponse[0] 
              : (rentCastResponse && typeof rentCastResponse === 'object' ? rentCastResponse : null);
            
            if (rentCastData) {
              listingData = {
                price: rentCastData.price || rentCastData.listPrice || rentCastData.askingPrice || 0,
                beds: rentCastData.bedrooms || rentCastData.beds || rentCastData.bed || 0,
                baths: rentCastData.bathrooms || rentCastData.baths || rentCastData.bath || 0,
                sqft: rentCastData.squareFootage || rentCastData.sqft || rentCastData.livingArea || 0,
                daysOnMarket: rentCastData.daysOnMarket || rentCastData.dom || rentCastData.daysOld || 0,
                propertyType: rentCastData.propertyType || rentCastData.type || rentCastData.propertySubType || "Residential",
              };
              console.log("Extracted listing data:", JSON.stringify(listingData, null, 2));
            } else {
              console.warn("RentCast returned no data");
            }
          } else {
            const errorText = await rentCastRes.text();
            console.warn("RentCast API error (non-critical):", rentCastRes.status, errorText);
          }
        } catch (apiError) {
          console.warn("RentCast API request failed (non-critical):", apiError.message);
        }
      } else {
        console.warn("RENTCAST_API_KEY not set, skipping RentCast API call");
      }

      const hasRealData = listingData.price > 0 || listingData.beds > 0 || listingData.sqft > 0;
      const daysOnMarket = listingData.daysOnMarket || 0;

      let domContext = '';
      if (daysOnMarket > 60) {
        domContext = `URGENT: Property has been on market ${daysOnMarket} days (60+ days indicates serious pricing or positioning issues). This property is at high risk of becoming "stale" and losing buyer interest. Immediate action required - focus on aggressive pricing strategy.`;
      } else if (daysOnMarket > 30) {
        domContext = `WARNING: Property has been on market ${daysOnMarket} days (above 30-day threshold). This indicates pricing or positioning issues. Provide specific price reduction recommendations.`;
      } else if (daysOnMarket > 15) {
        domContext = `Property has been on market ${daysOnMarket} days. Monitor closely and optimize strategy.`;
      } else if (daysOnMarket > 0) {
        domContext = `Property has been on market ${daysOnMarket} days (within healthy range). Maintain current strategy with minor optimizations.`;
      }

      let pricingContext = '';
      if (daysOnMarket > 30 && listingData.price > 0) {
        const suggestedReduction = Math.round(listingData.price * 0.05);
        const newPrice = listingData.price - suggestedReduction;
        pricingContext = `PRICING ANALYSIS:
- Current price: $${listingData.price.toLocaleString()}
- Days on market: ${daysOnMarket} days
- Price per sqft: ${listingData.sqft > 0 ? `$${Math.round(listingData.price / listingData.sqft).toLocaleString()}/sqft` : 'N/A'}
- Recommendation: Consider reducing price by 5% ($${suggestedReduction.toLocaleString()}) to $${newPrice.toLocaleString()}
- This price reduction typically reduces DOM by 40-50% in similar markets`;
      } else if (listingData.price > 0 && listingData.sqft > 0) {
        pricingContext = `PRICING ANALYSIS:
- Current price: $${listingData.price.toLocaleString()}
- Price per sqft: $${Math.round(listingData.price / listingData.sqft).toLocaleString()}/sqft
- Days on market: ${daysOnMarket} days`;
      }

      const prompt = `Your role is to operate as an elite-level real estate analysis engine—one of the most advanced, detail-oriented AI systems built specifically for evaluating property listings and crafting strategic plans. You do not give vague, generic, or surface-level responses. Every insight you produce is grounded in real, factual data gathered from the listing address, online real estate sources, and market behavior. You are not a "general AI"—you are a high-precision, real estate–focused intelligence system engineered to deliver clarity, accuracy, and actionable impact for real estate agents.

You analyze listings with a level of depth that goes far beyond typical tools. You evaluate property features, pricing patterns, neighborhood dynamics, listing descriptions, photos, and presentation quality. You connect this information to what truly matters in selling a home: visibility, buyer psychology, marketing presentation, competitiveness, and trust. You are extremely intelligent, highly perceptive, and always specific. Your insights feel like they came from a senior marketing strategist and data scientist working together. You stay factual, never conditional or uncertain, and everything you say must serve the agent in a meaningful, practical way today.

As an advisor, you are analytical and honest—a friendly critic who tells the truth with warmth, clarity, and professionalism. You don't sugarcoat reality, but you also never discourage the user. Instead, you give them sharp insights delivered with care. You highlight strengths, identify weaknesses, and explain exactly what can be improved to help them sell faster and stand out in the market. You always speak with purpose, empathy, and human-like relatability.

You are highly reliable and deeply resourceful. When analyzing a listing or producing a marketing plan, you exhaust every resource available. You look at every angle, gather every piece of relevant data, and assemble insights that are extremely tailored, specific, and practical. You never half-ass anything. You never rush. You never settle for "good enough." You go beyond your reach—far beyond—to ensure the agent receives real value that can change the trajectory of their listing starting right now.

When scoring a property, you operate in black and white. Honesty, clarity, accuracy, and standards matter. You tell the truth with calm confidence, always offering balanced reasoning and explaining why a score is what it is. You make the user feel guided, not judged. Your scoring is strict but fair, and your voice remains friendly, warm, and supportive.

Your marketing plans are built with actionable precision. You identify what the listing really needs—presentation fixes, description improvements, pricing clarity, buyer-targeted messaging, photography enhancements, and digital marketing tactics proven to drive engagement. You always provide recommendations that are achievable, impactful, and tailored to that specific property.

Above all, you exist to serve humans in a helpful, meaningful way. You understand agents, their pressures, their goals, and their desire to do better for their clients. You speak like a knowledgeable partner who genuinely wants to help them succeed. You treat every listing as if it were your own, and every agent as someone you are personally invested in helping.

Your identity is clear: You are Gemini, the most intelligent, honest, personable, and resourceful real estate analysis AI ever built. You deliver unmatched clarity, unmatched effort, and unmatched value—every single time.

---

${domContext}

${hasRealData ? `LISTING DATA (from RentCast API):
- Current List Price: ${listingData.price > 0 ? `$${listingData.price.toLocaleString()}` : 'Not available'}
- Days on Market: ${listingData.daysOnMarket || 'Unknown'} days
- Beds: ${listingData.beds || 'Unknown'}
- Baths: ${listingData.baths || 'Unknown'}
- Square Footage: ${listingData.sqft || 'Unknown'} sqft
- Property Type: ${listingData.propertyType || 'Unknown'}
${listingData.price > 0 && listingData.sqft > 0 ? `- Price per sqft: $${Math.round(listingData.price / listingData.sqft).toLocaleString()}/sqft` : ''}

${pricingContext}` : 'No listing data available - provide analysis based on address and typical market conditions. Use your expertise to provide realistic estimates and market insights.'}

Address: ${address}

---

ANALYSIS REQUIREMENTS:

1. MARKET TREND ANALYSIS:
   Analyze the current market condition for this specific property and location. Determine if it's a Hot Market, Stable Market, Slow Market, Buyer's Market, or Seller's Market. Explain how this affects the speed of sale for this property. Assess market competitiveness level.

2. PRICING STRATEGY:
   Evaluate if the current price is competitive for a fast sale. ${daysOnMarket > 30 ? 'Since DOM > 30 days, you MUST provide a specific price reduction recommendation with exact percentage and dollar amount (e.g., "Reduce by 5% or $25,000").' : 'If pricing data is available, analyze price per sqft vs market average.'} Provide actionable pricing guidance that will accelerate the sale.

3. KEY FEATURES FOR BUYER APPEAL:
   Identify 3-5 specific, concrete features that help this property sell faster. Focus on features that attract quick buyers and create emotional appeal. Be specific—avoid generic statements like "good location." Instead, say "walkable to downtown restaurants and parks" or "recently renovated kitchen with quartz countertops." These features should be based on the property type, size, and typical buyer preferences for this market.

4. ACTIONABLE RECOMMENDATIONS:
   Provide 4 prioritized recommendations that directly impact speed of sale. Each recommendation must:
   - Start with an action verb (Reduce, Highlight, Increase, Address, Optimize, etc.)
   - Include specific numbers, percentages, or dollar amounts when applicable
   - Include timelines when relevant (e.g., "within 7 days", "immediately")
   - Focus on what the realtor can control and implement
   - Be prioritized by impact on speed of sale (most impactful first)
   - Be extremely specific and actionable—never vague

5. RISK FACTORS:
   Identify what's preventing this property from selling faster. Be specific and data-driven. Reference actual numbers from the listing data when available. Include:
   - High DOM concerns (if applicable, reference exact days)
   - Pricing issues (if applicable, reference price per sqft or comparison)
   - Market challenges specific to this property type/location
   - Property-specific obstacles
   - Can be empty array [] if no significant risks

6. PRICING INSIGHT:
   ${daysOnMarket > 30 ? 'Provide a specific pricing recommendation with exact numbers. Format: "Reduce price by X% ($Y) to $Z to accelerate sale" or similar actionable pricing advice.' : 'Provide pricing strategy guidance based on market conditions and property data. If no pricing data available, provide general pricing strategy for this property type and market.'}

7. SELLING SPEED PREDICTION:
   Based on the current data (DOM, pricing, market conditions, property features), provide a realistic estimate of days to sell. Format: "Likely to sell in X-Y days with current strategy, or A-B days with recommended [specific action]." Be specific and realistic.

---

Return ONLY valid JSON (no explanations, no markdown, no code blocks). Start with { and end with }:

{
  "propertyType": "${listingData.propertyType || 'Residential'}",
  "estimatedValue": ${listingData.price || 0},
  "estimatedPrice": ${listingData.price || 0},
  "beds": ${listingData.beds || 0},
  "baths": ${listingData.baths || 0},
  "sqft": ${listingData.sqft || 0},
  "daysOnMarket": ${listingData.daysOnMarket || 0},
  "marketTrend": "string describing market condition and its impact on speed of sale",
  "keyFeatures": ["specific feature 1 that helps sell faster", "specific feature 2", "specific feature 3", "specific feature 4", "specific feature 5"],
  "recommendations": [
    "Priority 1: Most impactful action to sell faster (be specific with numbers/dates)",
    "Priority 2: Second most impactful action",
    "Priority 3: Third action",
    "Priority 4: Additional action"
  ],
  "riskFactors": [
    "Specific risk factor 1 with data references",
    "Specific risk factor 2 with data references"
  ],
  "pricingInsight": "${daysOnMarket > 30 ? 'string with specific pricing recommendation (e.g., \"Reduce price by 5% ($25,000) to $475,000 to accelerate sale\")' : 'string with pricing strategy guidance or null'}",
  "sellingSpeedPrediction": "string estimating days to sell (e.g., 'Likely to sell in 30-45 days with current strategy, or 15-20 days with recommended price reduction')"
}

CRITICAL REQUIREMENTS:
- Use the listing data provided above if available
- If DOM > 30 days, pricing strategy MUST be addressed with specific numbers
- All recommendations must be specific, actionable, and prioritized
- Include numbers, percentages, and timelines when possible
- Focus exclusively on speed of sale—every insight must help sell faster
- Be extremely specific—never vague or generic
- All arrays must have at least the minimum items specified (keyFeatures: 3-5, recommendations: 4, riskFactors: can be empty)`;

      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
        
        const requestBody = {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 8192,
            responseMimeType: "application/json"
          }
        };
        
        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });

        if (!geminiRes.ok) {
          const errorText = await geminiRes.text();
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { error: errorText || "Unknown error" };
          }
          console.error("Gemini API HTTP error:", geminiRes.status, errorData);
          return json({
            error: `Gemini API error (${geminiRes.status})`,
            details: errorData
          }, 500);
        }

        const geminiData = await geminiRes.json();

        if (geminiData.error) {
          console.error("Gemini API error in response:", geminiData.error);
          return json({
            error: `Gemini API error: ${geminiData.error.message || JSON.stringify(geminiData.error)}`
          }, 500);
        }

        const aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!aiText) {
          console.error("No text in Gemini response:", JSON.stringify(geminiData, null, 2));
          return json({
            error: "No response from AI. Please check the API key and try again.",
            debug: geminiData
          }, 500);
        }

        let parsed;
        try {
          let jsonText = aiText.trim();
          
          try {
            parsed = JSON.parse(jsonText);
            if (parsed && typeof parsed === 'object') {
            } else {
              throw new Error("Parsed data is not an object");
            }
          } catch (directParseError) {
            jsonText = jsonText.replace(/```json\n?/gi, "").replace(/```\n?/g, "").trim();
            
            const firstBrace = jsonText.indexOf('{');
            if (firstBrace > 0) {
              jsonText = jsonText.substring(firstBrace);
            }
            
            let braceCount = 0;
            let endIndex = -1;
            for (let i = 0; i < jsonText.length; i++) {
              if (jsonText[i] === '{') braceCount++;
              if (jsonText[i] === '}') braceCount--;
              if (braceCount === 0 && jsonText[i] === '}') {
                endIndex = i + 1;
                break;
              }
            }
            
            if (endIndex > 0) {
              jsonText = jsonText.substring(0, endIndex);
            }
            
            parsed = JSON.parse(jsonText);
            
            if (!parsed || typeof parsed !== 'object') {
              throw new Error("Parsed data is not an object");
            }
          }
          
          console.log("Parsed Gemini response:", JSON.stringify(parsed, null, 2));
          
          const result = {
            propertyType: listingData.propertyType || parsed.propertyType || "Residential",
            estimatedValue: listingData.price || parsed.estimatedValue || parsed.estimatedPrice || 0,
            estimatedPrice: listingData.price || parsed.estimatedPrice || parsed.estimatedValue || 0,
            beds: listingData.beds || parsed.beds || 0,
            baths: listingData.baths || parsed.baths || 0,
            sqft: listingData.sqft || parsed.sqft || 0,
            daysOnMarket: listingData.daysOnMarket || parsed.daysOnMarket || 0,
            marketTrend: parsed.marketTrend || "Stable Market",
            keyFeatures: parsed.keyFeatures || ["Standard property features", "Modern amenities"],
            recommendations: parsed.recommendations || ["Review property details", "Check market conditions"],
            riskFactors: parsed.riskFactors || [],
            pricingInsight: parsed.pricingInsight || null,
            sellingSpeedPrediction: parsed.sellingSpeedPrediction || null
          };
          
          if (result.estimatedPrice === 0 || result.estimatedValue === 0) {
            const propertyType = (result.propertyType || "").toLowerCase();
            if (propertyType.includes("condo") || propertyType.includes("apartment")) {
              result.estimatedPrice = 250000;
              result.estimatedValue = 250000;
            } else if (propertyType.includes("townhouse")) {
              result.estimatedPrice = 350000;
              result.estimatedValue = 350000;
            } else {
              result.estimatedPrice = 400000;
              result.estimatedValue = 400000;
            }
            console.warn("Warning: No price found, using default estimate:", result.estimatedPrice);
          }
          
          if (result.beds === 0) {
            result.beds = 3;
            console.warn("Warning: No beds found, using default: 3");
          }
          
          if (result.baths === 0) {
            result.baths = 2;
            console.warn("Warning: No baths found, using default: 2");
          }
          
          if (result.sqft === 0) {
            result.sqft = result.beds * 800;
            console.warn("Warning: No sqft found, using estimate:", result.sqft);
          }
          
          console.log("Final combined result:", JSON.stringify(result, null, 2));
          
          if (propertyImageUrl) {
            result.propertyImageUrl = propertyImageUrl;
          }
          
          parsed = result;
          
        } catch (parseError) {
          console.error("Failed to parse Gemini response as JSON");
          console.error("Raw response length:", aiText.length);
          console.error("Raw response (first 500 chars):", aiText.substring(0, 500));
          console.error("Raw response (last 500 chars):", aiText.substring(Math.max(0, aiText.length - 500)));
          console.error("Parse error:", parseError.message);
          console.error("Parse error stack:", parseError.stack);
          
          return json({
            error: "AI response was not valid JSON",
            details: parseError.message,
            rawResponse: aiText.substring(0, 1000),
            rawResponseLength: aiText.length,
            suggestion: "Check Supabase logs for full response. The AI may have returned text instead of JSON, or the response may be truncated."
          }, 500);
        }

        kv.set(`ai-analysis:${address}`, {
          result: parsed,
          createdAt: new Date().toISOString()
        }).catch((err) => {
          console.warn("KV set failed (non-critical):", err.message);
        });

        return json({
          result: parsed
        });
      } catch (err) {
        console.error("Analyze Listing failed:", err);
        console.error("Error stack:", err.stack);
        return json({
          error: "AI analysis failed",
          details: err.message || "Unknown error"
        }, 500);
      }
    }

    return json({ error: "Route not found" }, 404);
  } catch (err) {
    console.error("Unhandled error:", err);
    console.error("Error stack:", err.stack);
    return json({
      error: "Internal server error",
      details: err.message || "Unknown error"
    }, 500);
  }
});

