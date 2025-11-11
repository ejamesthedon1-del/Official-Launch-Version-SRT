
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
      return new Response("ok", {
        headers: corsHeaders
      });
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
        return json({
          error: "Input required"
        }, 400);
      }

      const apiKey = Deno.env.get("GOOGLE_PLACES_API_KEY") || "";
      if (!apiKey) {
        console.error("GOOGLE_PLACES_API_KEY is missing");
        return json({
          error: "Places API key missing"
        }, 500);
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
        return json({
          error: "Amount is required"
        }, 400);
      }

      if (!stripeSecret) {
        console.error("STRIPE_SECRET_KEY is missing");
        return json({
          error: "Stripe secret key missing"
        }, 500);
      }

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100),
          currency: "usd",
          metadata: {
            address: address,
            service: "listing-analytics-premium",
          },
          automatic_payment_methods: {
            enabled: true
          }
        });

        return json({
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id
        });
      } catch (err) {
        console.error("Error creating payment intent:", err);
        return json({
          error: "Failed to create payment intent",
          details: err.message
        }, 500);
      }
    }

    if (path.endsWith("/verify-payment") && req.method === "POST") {
      const paymentIntentId = body.paymentIntentId;
      
      if (!paymentIntentId) {
        return json({
          error: "Payment intent ID is required"
        }, 400);
      }

      if (!stripeSecret) {
        console.error("STRIPE_SECRET_KEY is missing");
        return json({
          error: "Stripe secret key missing"
        }, 500);
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
          return json({
            success: true,
            status: paymentIntent.status
          });
        }

        return json({
          success: false,
          status: paymentIntent.status
        });
      } catch (err) {
        console.error("Error verifying payment:", err);
        return json({
          error: "Failed to verify payment",
          details: err.message
        }, 500);
      }
    }

    if (path.endsWith("/check-subscription") && req.method === "POST") {
      const address = body.address;
      
      if (!address) {
        return json({
          error: "Address is required"
        }, 400);
      }

      try {
        const subscription = await kv.get(`subscription:${address}`);
        return json({
          hasSubscription: !!subscription,
          subscription
        });
      } catch (err) {
        console.error("Error checking subscription:", err);
        return json({
          error: "Failed to check subscription",
          details: err.message
        }, 500);
      }
    }

    // ============================================
    // ANALYZE LISTING ENDPOINT
    // ============================================
    // NEW FEATURE: Google Places Photo Support
    // - Accepts optional placeId parameter from frontend
    // - Fetches property photos from Google Places API
    // - Returns propertyImageUrl in the response
    // - Frontend displays actual property photos when available
    // ============================================
    if (path.endsWith("/analyze-listing") && req.method === "POST") {
      const address = body.address;
      const placeId = body.placeId; // Optional: Google Places place_id for photos
      if (!address) {
        return json({
          error: "Address required"
        }, 400);
      }

      const geminiApiKey = Deno.env.get("GEMINI_API_KEY") || "";
      const rentCastApiKey = Deno.env.get("RENTCAST_API_KEY") || "";
      const placesApiKey = Deno.env.get("GOOGLE_PLACES_API_KEY") || "";
      
      if (!geminiApiKey) {
        console.error("GEMINI_API_KEY is missing");
        return json({
          error: "Gemini API key missing"
        }, 500);
      }

      // Step 0: Get property photo from Google Places API (if placeId provided)
      let propertyImageUrl = null;
      if (placeId && placesApiKey) {
        try {
          // Get place details to access photos
          const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=photos&key=${placesApiKey}`;
          const placeDetailsRes = await fetch(placeDetailsUrl);
          
          if (placeDetailsRes.ok) {
            const placeDetails = await placeDetailsRes.json();
            if (placeDetails.result?.photos && placeDetails.result.photos.length > 0) {
              // Get the first photo reference
              const photoReference = placeDetails.result.photos[0].photo_reference;
              // Build the photo URL (maxwidth 800 for good quality)
              propertyImageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${placesApiKey}`;
              console.log("Found property photo:", propertyImageUrl);
            }
          }
        } catch (photoError) {
          console.warn("Failed to fetch property photo (non-critical):", photoError.message);
          // Continue without photo - not critical
        }
      }

      // Step 1: Get listing data from RentCast API
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
          // RentCast API endpoint - accepts address parameter directly
          // Format: "Street, City, State, Zip"
          const rentCastUrl = `https://api.rentcast.io/v1/listings/sale?address=${encodeURIComponent(address)}&status=Active&limit=5`;
          
          console.log("Calling RentCast API:", rentCastUrl);
          
          const rentCastRes = await fetch(rentCastUrl, {
            method: "GET",
            headers: {
              "X-Api-Key": rentCastApiKey, // RentCast uses X-Api-Key header
              "Content-Type": "application/json"
            }
          });

          if (rentCastRes.ok) {
            const rentCastResponse = await rentCastRes.json();
            console.log("RentCast API response:", JSON.stringify(rentCastResponse, null, 2));
            
            // RentCast returns an array - take the first result (most relevant match)
            const rentCastData = Array.isArray(rentCastResponse) && rentCastResponse.length > 0 
              ? rentCastResponse[0] 
              : (rentCastResponse && typeof rentCastResponse === 'object' ? rentCastResponse : null);
            
            if (rentCastData) {
              // Map RentCast response to our format
              // Adjust field names based on RentCast's actual response structure
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
            // Continue with Gemini if RentCast fails
          }
        } catch (apiError) {
          console.warn("RentCast API request failed (non-critical):", apiError.message);
          // Continue with Gemini if RentCast fails
        }
      } else {
        console.warn("RENTCAST_API_KEY not set, skipping RentCast API call");
      }

      // Step 2: Get AI analysis from Gemini (using RentCast data if available)
      const hasRealData = listingData.price > 0 || listingData.beds > 0 || listingData.sqft > 0;
      
      const prompt = `Analyze this property and provide market insights and recommendations. 

${hasRealData ? `LISTING DATA (from RentCast API):
- Price: ${listingData.price > 0 ? `$${listingData.price.toLocaleString()}` : 'Not available'}
- Beds: ${listingData.beds || 'Unknown'}
- Baths: ${listingData.baths || 'Unknown'}
- Sqft: ${listingData.sqft || 'Unknown'}
- Days on Market: ${listingData.daysOnMarket || 'Unknown'}
- Property Type: ${listingData.propertyType || 'Unknown'}` : 'No listing data available - provide analysis based on address and typical market conditions.'}

Address: ${address}

Return ONLY valid JSON (no explanations, no markdown):
{
  "marketTrend": "string (e.g., Hot Market, Stable Market, Slow Market, Buyer's Market, Seller's Market)",
  "keyFeatures": ["string", "string"] (at least 2 specific property features),
  "recommendations": ["string", "string"] (at least 2 actionable recommendations),
  "riskFactors": ["string"] (can be empty array if none)
}

IMPORTANT:
- Use the listing data provided above if available
- Provide specific, actionable recommendations
- Be realistic about market trends based on the data
- All arrays must have at least 2 items (except riskFactors which can be empty)`;

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
            errorData = {
              error: errorText || "Unknown error"
            };
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

        // Robust JSON parsing - handle multiple formats
        let parsed;
        try {
          let jsonText = aiText.trim();
          
          // First, try parsing directly (in case responseMimeType worked correctly)
          try {
            parsed = JSON.parse(jsonText);
            if (parsed && typeof parsed === 'object') {
              // Success! Use this parsed result
            } else {
              throw new Error("Parsed data is not an object");
            }
          } catch (directParseError) {
            // Direct parse failed, try cleaning the response
            
            // Remove markdown code blocks if present
            jsonText = jsonText.replace(/```json\n?/gi, "").replace(/```\n?/g, "").trim();
            
            // Remove any text before the first {
            const firstBrace = jsonText.indexOf('{');
            if (firstBrace > 0) {
              jsonText = jsonText.substring(firstBrace);
            }
            
            // Find the matching closing brace for the first {
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
            
            // Try parsing the cleaned JSON
            parsed = JSON.parse(jsonText);
            
            // Validate that we have the required fields
            if (!parsed || typeof parsed !== 'object') {
              throw new Error("Parsed data is not an object");
            }
          }
          
          // Log the parsed data for debugging
          console.log("Parsed Gemini response:", JSON.stringify(parsed, null, 2));
          
          // Note: Validation and fallbacks are now handled after combining RealtyMole + Gemini data
          
          // Step 3: Combine RentCast data with Gemini analysis
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
            riskFactors: parsed.riskFactors || []
          };
          
          // Apply validation/fallbacks if still needed
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
          
          // Use the combined result instead of parsed
          parsed = result;
          
        } catch (parseError) {
          console.error("Failed to parse Gemini response as JSON");
          console.error("Raw response length:", aiText.length);
          console.error("Raw response (first 500 chars):", aiText.substring(0, 500));
          console.error("Raw response (last 500 chars):", aiText.substring(Math.max(0, aiText.length - 500)));
          console.error("Parse error:", parseError.message);
          console.error("Parse error stack:", parseError.stack);
          
          // Try to provide a helpful error with more context
          return json({
            error: "AI response was not valid JSON",
            details: parseError.message,
            rawResponse: aiText.substring(0, 1000),
            rawResponseLength: aiText.length,
            suggestion: "Check Supabase logs for full response. The AI may have returned text instead of JSON, or the response may be truncated."
          }, 500);
        }

        // Add property image URL to the result if available
        if (propertyImageUrl) {
          parsed.propertyImageUrl = propertyImageUrl;
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

    return json({
      error: "Route not found"
    }, 404);
  } catch (err) {
    console.error("Unhandled error:", err);
    console.error("Error stack:", err.stack);
    return json({
      error: "Internal server error",
      details: err.message || "Unknown error"
    }, 500);
  }
});
```
