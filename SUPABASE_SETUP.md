# Supabase Edge Function Setup Guide

Your backend is a **Supabase Edge Function** (not a local Node.js server). The frontend calls it via `supabase.functions.invoke()`.

## Important: Environment Variables in Supabase

Supabase Edge Functions use environment variables set in the **Supabase Dashboard**, not your local `.env` file.

## Step 1: Set Environment Variables in Supabase Dashboard

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **Project Settings** (gear icon) → **Edge Functions** → **Secrets**
3. Add the following secrets:

```
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
SUPABASE_URL=https://qsslpkxyhcevqqcuwwrc.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Note:** 
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` are usually already available, but you can set them explicitly
- These are different from the `VITE_` prefixed variables in your `.env` file

## Step 2: Deploy the Edge Function

If you have the Supabase CLI installed:

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref qsslpkxyhcevqqcuwwrc

# Deploy the function
supabase functions deploy make-server-52cdd920
```

Or deploy via the Supabase Dashboard:
1. Go to **Edge Functions** in your dashboard
2. Click **Create a new function**
3. Name it `make-server-52cdd920`
4. Copy the code from `supabase/functions/make-server-52cdd920/index.ts`
5. Deploy

## Step 3: Test the Function

After deployment, test it:

```bash
# Test autocomplete
curl -X POST https://qsslpkxyhcevqqcuwwrc.supabase.co/functions/v1/make-server-52cdd920/places-autocomplete \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"input": "123 Main St"}'

# Test analyze listing
curl -X POST https://qsslpkxyhcevqqcuwwrc.supabase.co/functions/v1/make-server-52cdd920/analyze-listing \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"address": "123 Main St, New York, NY"}'
```

## Troubleshooting

### "Places API key missing" or "Gemini API key missing"
- Make sure you set the secrets in Supabase Dashboard → Edge Functions → Secrets
- The variable names must be exactly: `GOOGLE_PLACES_API_KEY` and `GEMINI_API_KEY` (no `VITE_` prefix)

### Function not found
- Make sure the function is deployed
- Check the function name matches: `make-server-52cdd920`
- Verify the path in your frontend code matches the function name

### CORS errors
- The function already includes CORS headers
- Make sure you're calling it from the correct origin

## Local Development (Optional)

If you want to test the Edge Function locally:

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase (requires Docker)
supabase start

# Serve functions locally
supabase functions serve make-server-52cdd920
```

## Key Differences from Local Server

- **Runtime**: Deno (not Node.js)
- **Environment Variables**: Set in Supabase Dashboard, not `.env` file
- **Deployment**: Deployed to Supabase, not running locally
- **Access**: Via `supabase.functions.invoke()` in your frontend

