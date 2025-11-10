# Setup Guide for Autosuggestion and Gemini AI

This guide will help you configure your autosuggestion (Google Places API) and Gemini AI features.

## Prerequisites

1. **Google Places API Key** - For address autosuggestion
2. **Google Gemini API Key** - For AI listing analysis
3. **Supabase Account** - For backend functions
4. **Stripe Account** (optional) - For payment processing

## Step 1: Get Your API Keys

### Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Places API"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key
   - (Optional) Restrict the API key to only allow Places API

### Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key
5. Make sure the API key has access to Gemini 1.5 Flash model

## Step 2: Configure Environment Variables

Create a `.env` file in the root of your project with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Places API (for autosuggestion)
VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# Google Gemini API (for AI analysis)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Stripe Configuration (optional)
VITE_STRIPE_SECRET_KEY=your_stripe_secret_key_here

# Server Port (optional, defaults to 8787)
PORT=8787
```

**Important:** 
- Replace all placeholder values with your actual API keys
- Never commit your `.env` file to version control
- The `.env` file should already be in `.gitignore`

## Step 3: Install Dependencies

If you haven't already, install all dependencies:

```bash
npm install
```

## Step 4: Start the Server

The server handles both autosuggestion and Gemini AI requests. Start it with:

```bash
npm run server
```

Or for development with auto-reload:

```bash
npm run server:dev
```

The server will run on `http://localhost:8787` by default.

## Step 5: Start the Frontend

In a separate terminal, start the Vite development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` by default.

## Troubleshooting

### Autosuggestion Not Working

1. **Check API Key**: Verify your `VITE_GOOGLE_PLACES_API_KEY` is set correctly
2. **Check API Status**: Ensure Places API is enabled in Google Cloud Console
3. **Check Server Logs**: Look for errors in the server console
4. **Check Browser Console**: Open DevTools and check for network errors
5. **API Quotas**: Make sure you haven't exceeded your API quota

### Gemini AI Not Working

1. **Check API Key**: Verify your `VITE_GEMINI_API_KEY` is set correctly
2. **Check API Access**: Ensure your API key has access to Gemini models
3. **Check Server Logs**: Look for detailed error messages in the server console
4. **Check Response Format**: The AI should return JSON - check server logs if parsing fails
5. **API Quotas**: Make sure you haven't exceeded your API quota

### Server Not Starting

1. **Check Port**: Make sure port 8787 is not already in use
2. **Check Environment Variables**: Ensure all required variables are set
3. **Check Dependencies**: Run `npm install` to ensure all packages are installed
4. **Check Node Version**: Ensure you're using Node.js 18+ 

### Common Error Messages

- **"API key not configured"**: Your `.env` file is missing or the variable name is incorrect
- **"Places API error: REQUEST_DENIED"**: Your API key is invalid or Places API is not enabled
- **"Gemini API error: API key not valid"**: Your Gemini API key is invalid or expired
- **"No response from AI"**: The Gemini API returned an empty response (check API key and quotas)

## Testing

### Test Autosuggestion

1. Start the server: `npm run server`
2. Start the frontend: `npm run dev`
3. Navigate to the address input page
4. Type at least 3 characters in the address field
5. You should see autocomplete suggestions appear

### Test Gemini AI

1. Start the server: `npm run server`
2. Start the frontend: `npm run dev`
3. Navigate to the address input page
4. Enter a valid address
5. Click "Analyze My Listing"
6. You should see the AI analysis results

## Additional Notes

- The server must be running for both features to work
- Both features require valid API keys
- Make sure your `.env` file is in the root directory
- The server uses `dotenv` to load environment variables automatically

