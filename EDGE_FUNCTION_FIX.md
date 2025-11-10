# Edge Function Fix for Gemini AI

## Issue
Your Edge Function is using `gemini-2.5-flash` which doesn't exist. This is causing the 500 error.

## Fix

In your Supabase Edge Function code (`make-server-52cdd920/index.ts`), change this line:

**Before:**
```typescript
const geminiRes = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
```

**After:**
```typescript
const geminiRes = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
```

## Also Add responseMimeType

Update the request body to include `responseMimeType: "application/json"`:

```typescript
body: JSON.stringify({
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 2048,
    responseMimeType: "application/json"  // Add this line
  }
})
```

## Complete Fixed Code Section

Replace the analyze-listing section in your Edge Function with:

```typescript
// --- Analyze Listing ---
if (path.endsWith("/analyze-listing") && req.method === "POST") {
  const address = body.address;
  if (!address) {
    return json({ error: "Address required" }, 400);
  }

  const apiKey = Deno.env.get("GEMINI_API_KEY") || "";
  if (!apiKey) {
    return json({ error: "Gemini API key missing" }, 500);
  }

  const prompt = `You are a real estate listing analysis AI. Analyze this property address and provide a JSON object with the following structure:
{
  "propertyType": "string",
  "estimatedValue": "number",
  "marketTrend": "string",
  "keyFeatures": ["string"],
  "recommendations": ["string"],
  "riskFactors": ["string"]
}

Address: ${address}`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!geminiRes.ok) {
      const errorData = await geminiRes.json().catch(() => ({ error: "Unknown error" }));
      console.error("Gemini API error:", errorData);
      return json({ error: `Gemini API error: ${JSON.stringify(errorData)}` }, 500);
    }

    const geminiData = await geminiRes.json();

    // Check for API errors in response
    if (geminiData.error) {
      console.error("Gemini API error:", geminiData.error);
      return json(
        { error: `Gemini API error: ${geminiData.error.message || JSON.stringify(geminiData.error)}` },
        500
      );
    }

    const aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiText) {
      console.error("No text in Gemini response:", geminiData);
      return json({ error: "No response from AI. Please check the API key and try again." }, 500);
    }

    // Try to parse as JSON
    let parsed;
    try {
      const jsonText = aiText.trim().replace(/```json\n?|```/g, "");
      parsed = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", aiText);
      return json(
        { error: "AI response was not valid JSON", rawResponse: aiText },
        500
      );
    }

    // Store in KV (non-blocking)
    kv.set(`ai-analysis:${address}`, {
      result: parsed,
      createdAt: new Date().toISOString()
    }).catch((err) => console.warn("KV set failed:", err));

    return json({ result: parsed });
  } catch (err: any) {
    console.error("Analyze Listing failed:", err);
    return json({ error: "AI analysis failed", details: err.message }, 500);
  }
}
```

## Steps to Fix

1. Go to Supabase Dashboard → Edge Functions → make-server-52cdd920
2. Click "Edit" or "Update Function"
3. Find the line with `gemini-2.5-flash` and change it to `gemini-1.5-flash`
4. Add `responseMimeType: "application/json"` to the generationConfig
5. Deploy the updated function
6. Test again

## Verify Secrets

Also make sure in Supabase Dashboard → Edge Functions → Secrets:
- `GEMINI_API_KEY` is set (not `VITE_GEMINI_API_KEY`)
- The API key is valid and has access to Gemini models

