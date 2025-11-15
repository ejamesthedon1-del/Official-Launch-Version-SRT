# Apify Integration Code Snippet for Supabase

## Exact Code to Add to Supabase Edge Function

**Location**: Add this code in `/analyze-listing` endpoint, **after** the RentCast API call (around line 250) and **before** the `hasRealData` check.

---

```typescript
// ========== START APIFY INTEGRATION ==========
// Apify Realtor.com Scraper (Non-Critical Enhancement)
let apifyData = {
  photos: [],
  description: null,
  yearBuilt: null,
  lotSize: null,
  additionalFeatures: []
};

const apifyApiKey = Deno.env.get("APIFY_API_KEY") || "";
const apifyActorId = Deno.env.get("APIFY_ACTOR_ID") || "";

if (apifyApiKey && apifyActorId && address) {
  try {
    console.log("Starting Apify scraper for address:", address);
    
    // Start Apify run
    const apifyRunUrl = `https://api.apify.com/v2/acts/${apifyActorId}/runs`;
    const apifyRunRes = await fetch(apifyRunUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apifyApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        startUrls: [{ 
          url: `https://www.realtor.com/realestateandhomes-search/${encodeURIComponent(address)}` 
        }],
        maxConcurrency: 1
      })
    });

    if (apifyRunRes.ok) {
      const runData = await apifyRunRes.json();
      const runId = runData.data?.id;
      
      if (runId) {
        console.log("Apify run started, ID:", runId);
        
        // Wait for run to complete (with timeout)
        let attempts = 0;
        const maxAttempts = 30; // 30 seconds max wait
        let runStatus = "RUNNING";
        
        while (runStatus === "RUNNING" && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          
          const statusUrl = `https://api.apify.com/v2/actor-runs/${runId}`;
          const statusRes = await fetch(statusUrl, {
            headers: { 
              "Authorization": `Bearer ${apifyApiKey}`,
              "Content-Type": "application/json"
            }
          });
          
          if (statusRes.ok) {
            const statusData = await statusRes.json();
            runStatus = statusData.data?.status || "RUNNING";
            console.log(`Apify run status: ${runStatus} (attempt ${attempts + 1}/${maxAttempts})`);
          }
          
          attempts++;
        }
        
        // Get results if completed
        if (runStatus === "SUCCEEDED") {
          const datasetId = runData.data?.defaultDatasetId;
          if (datasetId) {
            const resultsUrl = `https://api.apify.com/v2/datasets/${datasetId}/items`;
            const resultsRes = await fetch(resultsUrl, {
              headers: { 
                "Authorization": `Bearer ${apifyApiKey}`,
                "Content-Type": "application/json"
              }
            });
            
            if (resultsRes.ok) {
              const results = await resultsRes.json();
              console.log("Apify results received:", results?.length || 0, "items");
              
              if (results && Array.isArray(results) && results.length > 0) {
                const listing = results[0];
                
                // Extract photos
                if (listing.photos && Array.isArray(listing.photos)) {
                  apifyData.photos = listing.photos
                    .filter(photo => photo && typeof photo === 'string')
                    .slice(0, 10); // Limit to 10 photos
                  console.log(`Extracted ${apifyData.photos.length} photos from Apify`);
                }
                
                // Extract description
                if (listing.description && typeof listing.description === 'string') {
                  apifyData.description = listing.description.trim();
                  console.log("Extracted description from Apify");
                }
                
                // Extract additional data
                if (listing.yearBuilt) {
                  apifyData.yearBuilt = parseInt(listing.yearBuilt) || null;
                }
                if (listing.lotSize) {
                  apifyData.lotSize = listing.lotSize;
                }
                
                // Extract features
                if (listing.features && Array.isArray(listing.features)) {
                  apifyData.additionalFeatures = listing.features
                    .filter(f => f && typeof f === 'string')
                    .slice(0, 20); // Limit to 20 features
                }
                
                // Enhance listingData with Apify data (only if RentCast didn't provide it)
                if (listingData.price === 0 && listing.price) {
                  listingData.price = parseFloat(listing.price) || 0;
                }
                if (listingData.beds === 0 && listing.bedrooms) {
                  listingData.beds = parseInt(listing.bedrooms) || 0;
                }
                if (listingData.baths === 0 && listing.bathrooms) {
                  listingData.baths = parseFloat(listing.bathrooms) || 0;
                }
                if (listingData.sqft === 0 && listing.squareFeet) {
                  listingData.sqft = parseInt(listing.squareFeet) || 0;
                }
                if (listingData.daysOnMarket === 0 && listing.daysOnMarket) {
                  listingData.daysOnMarket = parseInt(listing.daysOnMarket) || 0;
                }
                
                console.log("Apify data extracted successfully");
              }
            } else {
              console.warn("Failed to fetch Apify results:", resultsRes.status);
            }
          }
        } else if (runStatus === "FAILED") {
          console.warn("Apify run failed");
        } else {
          console.warn(`Apify run timed out or incomplete. Status: ${runStatus}`);
        }
      }
    } else {
      const errorText = await apifyRunRes.text();
      console.warn("Apify run creation failed:", apifyRunRes.status, errorText);
    }
  } catch (apifyError) {
    // Non-critical: Log but don't fail
    console.warn("Apify scraper failed (non-critical):", apifyError.message);
  }
} else {
  if (!apifyApiKey) {
    console.warn("APIFY_API_KEY not set, skipping Apify scraper");
  }
  if (!apifyActorId) {
    console.warn("APIFY_ACTOR_ID not set, skipping Apify scraper");
  }
}
// ========== END APIFY INTEGRATION ==========
```

---

## Update Gemini Prompt Section

**Location**: In the prompt construction, add Apify data after RentCast data section:

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

${apifyData.description ? `ADDITIONAL LISTING DATA (from Realtor.com):
${apifyData.description}

${apifyData.photos.length > 0 ? `- ${apifyData.photos.length} property photos available` : ''}
${apifyData.yearBuilt ? `- Year Built: ${apifyData.yearBuilt}` : ''}
${apifyData.lotSize ? `- Lot Size: ${apifyData.lotSize}` : ''}
${apifyData.additionalFeatures.length > 0 ? `- Additional Features: ${apifyData.additionalFeatures.slice(0, 10).join(', ')}` : ''}` : ''}
```

---

## Update Result Object

**Location**: In the result construction (around line 500), add new fields:

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
  // Apify enhancement data
  propertyPhotos: apifyData.photos.length > 0 ? apifyData.photos : null,
  propertyDescription: apifyData.description || null,
  yearBuilt: apifyData.yearBuilt || null,
  lotSize: apifyData.lotSize || null,
  additionalFeatures: apifyData.additionalFeatures.length > 0 ? apifyData.additionalFeatures : null
};

// Keep existing propertyImageUrl logic
if (propertyImageUrl) {
  result.propertyImageUrl = propertyImageUrl;
}
```

---

## Environment Variables

Add these to Supabase Edge Function secrets:

```
APIFY_API_KEY=your_apify_api_key
APIFY_ACTOR_ID=your_realtor_scraper_actor_id
```

---

## Testing

1. Test with Apify API key set - should enhance data
2. Test without Apify API key - should work with RentCast only
3. Test with invalid Actor ID - should log warning and continue
4. Test with Apify timeout - should continue after 30 seconds

---

## Notes

- All Apify calls are wrapped in try-catch
- Uses `console.warn` (not `console.error`) for failures
- Never throws errors - always continues with existing data
- 30-second timeout prevents hanging
- Data validation ensures type safety

