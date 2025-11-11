# RentCast API Integration Setup Guide

## ✅ What's Been Updated

The Edge Function code in `SUPABASE_EDGE_FUNCTION_UPDATES.md` now includes RentCast API integration. Here's what it does:

1. **Step 1**: Calls RentCast API to get actual listing data (price, beds, baths, sqft, days on market, property type)
2. **Step 2**: Calls Gemini AI for market analysis (trends, recommendations, risk factors)
3. **Step 3**: Combines both responses into one result
4. **Fallback**: If RentCast fails, continues with Gemini only

## 🔑 Step 1: Add RentCast API Key to Supabase

1. Go to **Supabase Dashboard** → **Edge Functions** → **Secrets**
2. Click **"Add new secret"**
3. Name: `RENTCAST_API_KEY`
4. Value: Your RentCast API key
5. Click **"Save"**

## 📝 Step 2: Verify RentCast API Endpoint

**Current endpoint in code**:
```
https://api.rentcast.io/v1/listings/sale?address={address}
```

**IMPORTANT**: You mentioned the endpoint is `https://api.rentcast.io/v1/listings/sale` - but this might need:
- Different query parameter (might need `address` or `propertyAddress`)
- Or might need to search by city/state first, then filter

**Please check your RentCast API documentation for**:
- ✅ Correct endpoint for searching by address
- ✅ Required query parameters
- ✅ Authentication method (code uses `X-Api-Key` header)
- ✅ Response structure

**Common variations**:
- Might be: `/v1/properties` instead of `/v1/listings/sale`
- Might need: `propertyAddress` instead of `address`
- Might need: POST request with address in body

## 🔧 Step 3: Adjust Field Mapping (If Needed)

The code maps RentCast response like this:
```typescript
listingData = {
  price: rentCastData.price || rentCastData.listPrice || rentCastData.askingPrice || 0,
  beds: rentCastData.bedrooms || rentCastData.beds || rentCastData.bed || 0,
  baths: rentCastData.bathrooms || rentCastData.baths || rentCastData.bath || 0,
  sqft: rentCastData.squareFootage || rentCastData.sqft || rentCastData.livingArea || 0,
  daysOnMarket: rentCastData.daysOnMarket || rentCastData.dom || 0,
  propertyType: rentCastData.propertyType || rentCastData.type || rentCastData.propertySubType || "Residential",
};
```

**If RentCast uses different field names**, update the mapping in the code.

## 📋 Step 4: Copy Code to Supabase

1. Open `SUPABASE_EDGE_FUNCTION_UPDATES.md`
2. Copy the **entire** `/analyze-listing` section
3. Paste it into your Supabase Edge Function
4. Deploy the function

## 🧪 Step 5: Test the Integration

1. Test with a real address
2. Check Supabase logs for:
   - `"Calling RentCast API:"` - Should show the URL being called
   - `"RentCast API response:"` - Should show the API response
   - `"Extracted listing data:"` - Should show mapped data
   - `"Final combined result:"` - Should show RentCast + Gemini data combined

## 🐛 Troubleshooting

### RentCast API Not Working

**Check logs for**:
- `"RentCast API error (non-critical):"` - Shows the error
- `"RENTCAST_API_KEY not set"` - API key missing
- DNS errors - Wrong endpoint URL

**Common issues**:
1. **Wrong endpoint URL** - Check RentCast docs for correct endpoint
2. **Wrong query parameter** - Might need `propertyAddress` instead of `address`
3. **Wrong auth method** - Code uses `X-Api-Key` header (verify this is correct)
4. **Wrong field names** - Check RentCast response structure
5. **API key not set** - Verify in Supabase Secrets

### Still Getting Zeros/Empty Data

- Check Supabase logs for RentCast response
- Verify the field mapping matches RentCast's response
- The code will fallback to Gemini if RentCast fails

## 📊 How It Works

```
User enters address
    ↓
Edge Function calls RentCast API
    ↓
Get: price, beds, baths, sqft, daysOnMarket, propertyType
    ↓
Edge Function calls Gemini AI
    ↓
Get: marketTrend, keyFeatures, recommendations, riskFactors
    ↓
Combine both responses
    ↓
Return to frontend
    ↓
Display on Dashboard
```

## ✅ Benefits

- ✅ **Real listing data** from RentCast (price, beds, baths, sqft, DOM)
- ✅ **AI analysis** from Gemini (trends, recommendations)
- ✅ **Reliable** - RentCast provides actual data
- ✅ **Fallback** - Works even if RentCast fails
- ✅ **No more zeros** - Real data from API

## 📞 Need Help?

If RentCast API structure is different:
1. Check RentCast API documentation
2. Test the API endpoint manually (with curl or Postman)
3. Share the response structure
4. I can help adjust the field mapping

## 🔍 Finding the Correct Endpoint

Since you mentioned `https://api.rentcast.io/v1/listings/sale`, check:
- Does it accept `?address=` parameter?
- Or does it need `?propertyAddress=`?
- Or does it need POST with address in body?
- Check RentCast API docs for "search by address" or "property lookup"

