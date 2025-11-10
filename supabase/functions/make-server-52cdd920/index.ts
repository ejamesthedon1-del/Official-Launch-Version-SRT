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
      if (!address) {
        return json({ error: "Address required" }, 400);
      }

      const apiKey = Deno.env.get("GEMINI_API_KEY") || "";
      if (!apiKey) {
        console.error("GEMINI_API_KEY is missing");
        return json({ error: "Gemini API key missing" }, 500);
      }

      const prompt = `You are a real estate listing analysis AI. Analyze this property address and provide a JSON object with the following structure. For estimated values, use realistic numbers based on the property type and location. If specific details are not available, provide reasonable estimates:
{
  "propertyType": "string (e.g., Single Family Home, Condo, Townhouse)",
  "estimatedValue": number (estimated property value in USD),
  "estimatedPrice": number (listing price, can be same as estimatedValue),
  "beds": number (number of bedrooms, estimate if unknown),
  "baths": number (number of bathrooms, estimate if unknown),
  "sqft": number (square footage, estimate if unknown),
  "marketTrend": "string (e.g., Hot Market, Stable Market, Slow Market)",
  "keyFeatures": ["string"],
  "recommendations": ["string"],
  "riskFactors": ["string"]
}

Address: ${address}`;

      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        
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
            temperature: 0.7,
            maxOutputTokens: 2048,
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
          return json(
            {
              error: `Gemini API error (${geminiRes.status})`,
              details: errorData
            },
            500
          );
        }

        const geminiData = await geminiRes.json();

        if (geminiData.error) {
          console.error("Gemini API error in response:", geminiData.error);
          return json(
            {
              error: `Gemini API error: ${geminiData.error.message || JSON.stringify(geminiData.error)}`
            },
            500
          );
        }

        const aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!aiText) {
          console.error("No text in Gemini response:", JSON.stringify(geminiData, null, 2));
          return json(
            {
              error: "No response from AI. Please check the API key and try again.",
              debug: geminiData
            },
            500
          );
        }

        let parsed;
        try {
          const jsonText = aiText.trim().replace(/```json\n?/g, "").replace(/```/g, "").trim();
          parsed = JSON.parse(jsonText);
        } catch (parseError) {
          console.error("Failed to parse Gemini response as JSON:", aiText);
          console.error("Parse error:", parseError.message);
          return json(
            {
              error: "AI response was not valid JSON",
              rawResponse: aiText.substring(0, 500)
            },
            500
          );
        }

        kv
          .set(`ai-analysis:${address}`, {
            result: parsed,
            createdAt: new Date().toISOString()
          })
          .catch((err) => {
            console.warn("KV set failed (non-critical):", err.message);
          });

        return json({
          result: parsed
        });
      } catch (err) {
        console.error("Analyze Listing failed:", err);
        console.error("Error stack:", err.stack);
        return json(
          {
            error: "AI analysis failed",
            details: err.message || "Unknown error"
          },
          500
        );
      }
    }

    return json({ error: "Route not found" }, 404);
  } catch (err) {
    console.error("Unhandled error:", err);
    console.error("Error stack:", err.stack);
    return json(
      {
        error: "Internal server error",
        details: err.message || "Unknown error"
      },
      500
    );
  }
});
