# RealtyMole API Integration Setup Guide

## ✅ What's Been Updated

The Edge Function code in `SUPABASE_EDGE_FUNCTION_UPDATES.md` now includes RealtyMole API integration. Here's what it does:

1. **Step 1**: Calls RealtyMole API to get actual listing data (price, beds, baths, sqft, days on market, property type)
2. **Step 2**: Calls Gemini AI for market analysis (trends, recommendations, risk factors)
3. **Step 3**: Combines both responses into one result
4. **Fallback**: If RealtyMole fails, continues with Gemini only

## 🔑 Step 1: Add RealtyMole API Key and Base URL to Supabase

1. Go to **Supabase Dashboard** → **Edge Functions** → **Secrets**
2. Click **"Add new secret"**
3. Name: `REALTYMOLE_API_KEY`
4. Value: Your RealtyMole API key
5. Click **"Save"**
6. **IMPORTANT**: Also add the API base URL:
   - Name: `REALTYMOLE_API_URL`
   - Value: Your RealtyMole API base URL (check your RealtyMole documentation)
   - Common examples:
     - `https://api.realtymole.com`
     - `https://realtymole.com/api`
     - `https://api.realtymole.io`
   - **Check your RealtyMole dashboard or API documentation for the correct base URL**

## 📝 Step 2: Find Your RealtyMole API Base URL

**CRITICAL**: The DNS error means the base URL is wrong. You need to find the correct one.

**How to find it**:
1. Check your **RealtyMole dashboard** or **API documentation**
2. Look for the **API base URL** or **endpoint URL**
3. Common patterns:
   - `https://api.realtymole.com`
   - `https://realtymole.com/api`
   - `https://api.realtymole.io`
   - Or a custom subdomain like `https://your-account.realtymole.com`

**What to verify**:
- ✅ Correct base URL (this is causing the DNS error)
- ✅ Endpoint path (usually `/v1/property` or `/api/v1/property`)
- ✅ Authentication method (Bearer token, API key in header, etc.)
- ✅ Required query parameters

**Common variations**:
- Endpoint might be: `/api/v1/property` or `/v1/properties`
- Auth might be: `X-API-Key` header instead of `Authorization: Bearer`
- Response fields might have different names

## 🔧 Step 3: Adjust Field Mapping (If Needed)

The code maps RealtyMole response like this:
```typescript
listingData = {
  price: realtyMoleData.price || realtyMoleData.listPrice || realtyMoleData.estimatedValue || 0,
  beds: realtyMoleData.beds || realtyMoleData.bedrooms || realtyMoleData.bed || 0,
  baths: realtyMoleData.baths || realtyMoleData.bathrooms || realtyMoleData.bath || 0,
  sqft: realtyMoleData.sqft || realtyMoleData.squareFootage || realtyMoleData.livingArea || 0,
  daysOnMarket: realtyMoleData.daysOnMarket || realtyMoleData.dom || 0,
  propertyType: realtyMoleData.propertyType || realtyMoleData.type || "Residential",
};
```

**If RealtyMole uses different field names**, update the mapping in the code.

## 📋 Step 4: Copy Code to Supabase

1. Open `SUPABASE_EDGE_FUNCTION_UPDATES.md`
2. Copy the **entire** `/analyze-listing` section
3. Paste it into your Supabase Edge Function
4. Deploy the function

## 🧪 Step 5: Test the Integration

1. Test with a real address
2. Check Supabase logs for:
   - `"RealtyMole API response:"` - Should show the API response
   - `"Extracted listing data:"` - Should show mapped data
   - `"Final combined result:"` - Should show RealtyMole + Gemini data combined

## 🐛 Troubleshooting

### RealtyMole API Not Working

**Check logs for**:
- `"RealtyMole API error (non-critical):"` - Shows the error
- `"REALTYMOLE_API_KEY not set"` - API key missing

**Common issues**:
1. **Wrong endpoint URL** - Check RealtyMole docs
2. **Wrong auth method** - Might need `X-API-Key` header instead of `Bearer`
3. **Wrong field names** - Check RealtyMole response structure
4. **API key not set** - Verify in Supabase Secrets

### Still Getting Zeros/Empty Data

- Check Supabase logs for RealtyMole response
- Verify the field mapping matches RealtyMole's response
- The code will fallback to Gemini if RealtyMole fails

## 📊 How It Works

```
User enters address
    ↓
Edge Function calls RealtyMole API
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

- ✅ **Real listing data** from RealtyMole (price, beds, baths, sqft, DOM)
- ✅ **AI analysis** from Gemini (trends, recommendations)
- ✅ **Reliable** - RealtyMole provides actual data
- ✅ **Fallback** - Works even if RealtyMole fails
- ✅ **No more zeros** - Real data from API

## 📞 Need Help?

If RealtyMole API structure is different:
1. Check RealtyMole API documentation
2. Test the API endpoint manually
3. Share the response structure
4. I can help adjust the field mapping

