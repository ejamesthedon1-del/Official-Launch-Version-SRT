# Quick Start Guide - Autosuggestion & Gemini AI

## What Was Fixed

1. ✅ **Server Startup**: Fixed the server initialization to properly use Hono with Node.js
2. ✅ **Error Handling**: Improved error handling for both Google Places API and Gemini API
3. ✅ **JSON Response**: Added `responseMimeType: "application/json"` to ensure Gemini returns valid JSON
4. ✅ **Server Scripts**: Added npm scripts to easily start the server

## Quick Setup (3 Steps)

### 1. Install Dependencies

```bash
npm install
```

This will install `tsx` which is needed to run the TypeScript server file.

### 2. Create `.env` File

Create a `.env` file in the root directory with your API keys:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_STRIPE_SECRET_KEY=your_stripe_key
PORT=8787
```

**Get your API keys:**
- **Google Places API**: https://console.cloud.google.com/ → Enable Places API → Create API Key
- **Gemini API**: https://makersuite.google.com/app/apikey → Create API Key

### 3. Start Everything

**Terminal 1 - Start the Server:**
```bash
npm run server
```

**Terminal 2 - Start the Frontend:**
```bash
npm run dev
```

## Testing

1. Open http://localhost:5173
2. Navigate to the address input page
3. **Test Autosuggestion**: Type at least 3 characters - you should see suggestions
4. **Test Gemini AI**: Enter an address and click "Analyze My Listing"

## Troubleshooting

### "API key not configured" Error
- Check your `.env` file exists and has the correct variable names
- Make sure there are no spaces around the `=` sign
- Restart the server after changing `.env`

### "Places API error: REQUEST_DENIED"
- Verify your Google Places API key is correct
- Make sure Places API is enabled in Google Cloud Console
- Check if your API key has restrictions that might block requests

### "Gemini API error"
- Verify your Gemini API key is correct
- Check the server console for detailed error messages
- Make sure your API key has access to Gemini models

### Server Won't Start
- Make sure port 8787 is not in use: `lsof -i :8787`
- Check that `tsx` is installed: `npm install`
- Check Node.js version: `node --version` (should be 18+)

## Need More Help?

See `SETUP.md` for detailed instructions and troubleshooting.

