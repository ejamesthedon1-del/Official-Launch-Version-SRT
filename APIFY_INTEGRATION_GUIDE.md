# Apify Realtor.com Scraper Integration Guide

## Overview

This guide shows how to integrate Apify Realtor.com scraper to enhance listing data with photos, descriptions, and additional property details without breaking existing functionality.

## Integration Strategy

**Key Principle**: Apify data is **enhancement only** - it supplements RentCast data but never replaces it. If Apify fails, the system continues with RentCast data only.

---

## Step 1: Supabase Edge Function Updates

### Add Apify API Call (Non-Critical)

Add this code in the `/analyze-listing` endpoint **after** the RentCast API call and **before** the Gemini prompt:

```typescript
// After RentCast API call (around line 250)
let apifyData = {
  photos: [],
  description: null,
  yearBuilt: null,
  lotSize: null,
  additionalFeatures: []
};

if (rentCastApiKey) {
  // ... existing RentCast code ...
}

// NEW: Apify Realtor.com Scraper (Non-Critical Enhancement)
const apifyApiKey = Deno.env.get("APIFY_API_KEY") || "";
const apifyActorId = Deno.env.get("APIFY_ACTOR_ID") || ""; // Your Realtor.com scraper actor ID

if (apifyApiKey && apifyActorId && address) {
  try {
    // Start Apify run
    const apifyRunUrl = `https://api.apify.com/v2/acts/${apifyActorId}/runs`;
    const apifyRunRes = await fetch(apifyRunUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apifyApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        startUrls: [{ url: `https://www.realtor.com/realestateandhomes-search/${encodeURIComponent(address)}` }],
        maxConcurrency: 1
      })
    });

    if (apifyRunRes.ok) {
      const runData = await apifyRunRes.json();
      const runId = runData.data?.id;
      
      if (runId) {
        // Wait for run to complete (with timeout)
        let attempts = 0;
        const maxAttempts = 30; // 30 seconds max wait
        let runStatus = "RUNNING";
        
        while (runStatus === "RUNNING" && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          
          const statusUrl = `https://api.apify.com/v2/actor-runs/${runId}`;
          const statusRes = await fetch(statusUrl, {
            headers: { "Authorization": `Bearer ${apifyApiKey}` }
          });
          
          if (statusRes.ok) {
            const statusData = await statusRes.json();
            runStatus = statusData.data?.status || "RUNNING";
          }
          
          attempts++;
        }
        
        // Get results if completed
        if (runStatus === "SUCCEEDED") {
          const resultsUrl = `https://api.apify.com/v2/datasets/${runId}/items`;
          const resultsRes = await fetch(resultsUrl, {
            headers: { "Authorization": `Bearer ${apifyApiKey}` }
          });
          
          if (resultsRes.ok) {
            const results = await resultsRes.json();
            if (results && results.length > 0) {
              const listing = results[0];
              
              // Extract photos
              if (listing.photos && Array.isArray(listing.photos)) {
                apifyData.photos = listing.photos.slice(0, 10); // Limit to 10 photos
              }
              
              // Extract description
              if (listing.description) {
                apifyData.description = listing.description;
              }
              
              // Extract additional data
              apifyData.yearBuilt = listing.yearBuilt || null;
              apifyData.lotSize = listing.lotSize || null;
              
              // Extract features
              if (listing.features && Array.isArray(listing.features)) {
                apifyData.additionalFeatures = listing.features;
              }
              
              // Enhance listingData with Apify data (only if RentCast didn't provide it)
              if (listingData.price === 0 && listing.price) {
                listingData.price = listing.price;
              }
              if (listingData.beds === 0 && listing.bedrooms) {
                listingData.beds = listing.bedrooms;
              }
              if (listingData.baths === 0 && listing.bathrooms) {
                listingData.baths = listing.bathrooms;
              }
              if (listingData.sqft === 0 && listing.squareFeet) {
                listingData.sqft = listing.squareFeet;
              }
              if (listingData.daysOnMarket === 0 && listing.daysOnMarket) {
                listingData.daysOnMarket = listing.daysOnMarket;
              }
              
              console.log("Apify data extracted:", JSON.stringify(apifyData, null, 2));
            }
          }
        }
      }
    }
  } catch (apifyError) {
    // Non-critical: Log but don't fail
    console.warn("Apify scraper failed (non-critical):", apifyError.message);
  }
} else {
  console.warn("APIFY_API_KEY or APIFY_ACTOR_ID not set, skipping Apify scraper");
}
```

### Update Gemini Prompt to Include Apify Data

Add Apify data to the prompt context (after RentCast data section):

```typescript
${hasRealData ? `LISTING DATA (from RentCast API):
- Current List Price: ${listingData.price > 0 ? `$${listingData.price.toLocaleString()}` : 'Not available'}
- Days on Market: ${listingData.daysOnMarket || 'Unknown'} days
- Beds: ${listingData.beds || 'Unknown'}
- Baths: ${listingData.baths || 'Unknown'}
- Square Footage: ${listingData.sqft || 'Unknown'} sqft
- Property Type: ${listingData.propertyType || 'Unknown'}
${listingData.price > 0 && listingData.sqft > 0 ? `- Price per sqft: $${Math.round(listingData.price / listingData.sqft).toLocaleString()}/sqft` : ''}

${pricingContext}` : 'No listing data available - provide analysis based on address and typical market conditions. Use your expertise to provide realistic estimates and market insights.'}

${apifyData.description ? `LISTING DESCRIPTION (from Realtor.com):
${apifyData.description}

${apifyData.photos.length > 0 ? `- ${apifyData.photos.length} photos available for analysis` : ''}
${apifyData.yearBuilt ? `- Year Built: ${apifyData.yearBuilt}` : ''}
${apifyData.lotSize ? `- Lot Size: ${apifyData.lotSize}` : ''}
${apifyData.additionalFeatures.length > 0 ? `- Additional Features: ${apifyData.additionalFeatures.join(', ')}` : ''}` : ''}
```

### Update JSON Response to Include Apify Data

Add new fields to the result object (around line 500):

```typescript
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
  sellingSpeedPrediction: parsed.sellingSpeedPrediction || null,
  // NEW: Apify enhancement data
  propertyPhotos: apifyData.photos.length > 0 ? apifyData.photos : null,
  propertyDescription: apifyData.description || null,
  yearBuilt: apifyData.yearBuilt || null,
  lotSize: apifyData.lotSize || null,
  additionalFeatures: apifyData.additionalFeatures.length > 0 ? apifyData.additionalFeatures : null
};

// Keep existing propertyImageUrl logic (Google Places photo)
if (propertyImageUrl) {
  result.propertyImageUrl = propertyImageUrl;
}
```

---

## Step 2: Frontend Updates

### Update AddressInput.tsx to Handle New Fields

Add new fields to the `transformAnalysisData` function:

```typescript
return {
  listing: {
    address: address,
    city: city,
    propertyType: geminiData.propertyType || "Residential",
    price: estimatedValue > 0 ? `$${estimatedValue.toLocaleString()}` : "Price not available",
    pricePerSqft: pricePerSqft > 0 ? `$${pricePerSqft.toLocaleString()}` : "N/A",
    beds: beds,
    baths: baths,
    sqft: sqft > 0 ? sqft.toLocaleString() : "N/A",
    daysOnMarket: daysOnMarket,
    imageUrl: geminiData.propertyImageUrl || null,
    // NEW: Apify data
    photos: geminiData.propertyPhotos || null,
    description: geminiData.propertyDescription || null,
    yearBuilt: geminiData.yearBuilt || null,
    lotSize: geminiData.lotSize || null,
    additionalFeatures: geminiData.additionalFeatures || null
  },
  // ... rest of existing code ...
};
```

### Update App.tsx Interface

Add new fields to the `AnalysisData` interface:

```typescript
interface AnalysisData {
  listing: {
    address: string;
    city: string;
    propertyType: string;
    price: string;
    pricePerSqft: string;
    beds: number;
    baths: number;
    sqft: string;
    daysOnMarket: number;
    imageUrl?: string | null;
    // NEW: Apify fields
    photos?: string[] | null;
    description?: string | null;
    yearBuilt?: number | null;
    lotSize?: string | null;
    additionalFeatures?: string[] | null;
  };
  // ... rest of existing interface ...
}
```

---

## Step 3: Environment Variables

Add to your Supabase Edge Function secrets:

```
APIFY_API_KEY=your_apify_api_key_here
APIFY_ACTOR_ID=your_realtor_scraper_actor_id_here
```

---

## Step 4: Error Handling Strategy

### Non-Critical Pattern

All Apify calls use try-catch with `console.warn` (not `console.error`):

```typescript
try {
  // Apify API call
} catch (apifyError) {
  console.warn("Apify scraper failed (non-critical):", apifyError.message);
  // Continue with existing data - don't throw error
}
```

**Why**: If Apify fails, the system continues with RentCast data only. The analysis still works.

---

## Step 5: Data Priority

**Priority Order** (highest to lowest):
1. **RentCast API** - Primary source for core listing data
2. **Apify Scraper** - Enhancement for photos, descriptions, additional features
3. **Google Places API** - Fallback for property photo
4. **AI Estimates** - Default values if no data available

**Merge Logic**:
- RentCast data always takes priority for: price, beds, baths, sqft, DOM
- Apify data enhances: photos, description, yearBuilt, lotSize, features
- If both have same field, RentCast wins (it's more reliable)

---

## Step 6: Testing Checklist

- [ ] Apify API key and Actor ID set in Supabase secrets
- [ ] Apify call doesn't break if API key is missing
- [ ] Apify call doesn't break if scraper fails
- [ ] RentCast data still works if Apify fails
- [ ] Photos array is properly formatted
- [ ] Description is passed to Gemini prompt
- [ ] New fields appear in frontend (optional - can add later)
- [ ] Analysis completes successfully even if Apify times out

---

## Step 7: Optional Frontend Display

If you want to display photos/description on dashboard later:

### Add Photo Gallery Section (Optional)

```typescript
// In Dashboard.tsx
{analysisData.listing.photos && analysisData.listing.photos.length > 0 && (
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-4">Property Photos</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {analysisData.listing.photos.slice(0, 8).map((photo, idx) => (
        <img 
          key={idx} 
          src={photo} 
          alt={`Property photo ${idx + 1}`}
          className="w-full h-32 object-cover rounded-lg"
        />
      ))}
    </div>
  </div>
)}
```

---

## Important Notes

1. **Apify is Enhancement Only**: Never make it required. If it fails, analysis continues.
2. **Timeout Protection**: Apify call has 30-second max wait to prevent hanging.
3. **Data Validation**: Always check if Apify data exists before using it.
4. **Cost Consideration**: Apify runs cost credits - consider caching results.
5. **Rate Limiting**: Be mindful of Apify rate limits to avoid blocking.

---

## Quick Integration Checklist

1. ✅ Add Apify API call after RentCast (non-critical try-catch)
2. ✅ Merge Apify data into listingData (only fill missing RentCast fields)
3. ✅ Add Apify data to Gemini prompt context
4. ✅ Add new fields to result object
5. ✅ Update frontend transformAnalysisData (optional)
6. ✅ Update App.tsx interface (optional)
7. ✅ Set environment variables in Supabase
8. ✅ Test with and without Apify API key

---

## Example: Complete Apify Integration Block

See `APIFY_SUPABASE_CODE_SNIPPET.md` for the exact code to paste into your Supabase edge function.

