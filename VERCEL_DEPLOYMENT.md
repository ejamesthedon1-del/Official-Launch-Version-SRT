# Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Environment Variables in Vercel
Add these in **Vercel Dashboard → Project Settings → Environment Variables**:

```
VITE_SUPABASE_URL=https://qsslpkxyhcevqqcuwwrc.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Important Notes:**
- `VITE_STRIPE_SECRET_KEY` is NOT needed in Vercel (it's only for backend/Supabase)
- Use **production** Stripe keys if you're going live, or **test** keys for testing
- Make sure to add these for **Production**, **Preview**, and **Development** environments

### 2. Supabase Edge Function Secrets
Verify these are set in **Supabase Dashboard → Edge Functions → Secrets**:

```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
GOOGLE_PLACES_API_KEY=your_google_places_key_here
GEMINI_API_KEY=your_gemini_key_here
SUPABASE_URL=https://qsslpkxyhcevqqcuwwrc.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Test Build Locally
Before deploying, test the build:

```bash
npm run build
npm run preview
```

Make sure the build completes without errors.

### 4. Database Setup
Make sure RLS is disabled on `kv_store_52cdd920` table (you already did this).

## 🚀 Deploy to Vercel

### Option 1: Via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your Git repository
4. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Add all environment variables (from step 1 above)
6. Click **"Deploy"**

### Option 2: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# For production
vercel --prod
```

## ✅ Post-Deployment Checklist

1. **Test the live site:**
   - ✅ Autosuggestion works
   - ✅ AI analysis works
   - ✅ Payment flow works
   - ✅ Dashboard displays correctly

2. **Update Stripe Webhook (if needed):**
   - If you set up webhooks, update the webhook URL to your Vercel domain

3. **Domain Setup (optional):**
   - Add your custom domain in Vercel Dashboard
   - Update CORS settings if needed

4. **Monitor:**
   - Check Vercel logs for any errors
   - Check Supabase Edge Function logs
   - Monitor Stripe dashboard for payments

## 🔒 Security Notes

- ✅ Never commit `.env` file
- ✅ Use environment variables in Vercel (not hardcoded)
- ✅ Use test keys for testing, production keys for live
- ✅ Service role key should ONLY be in Supabase secrets (never in frontend)

## 🐛 Troubleshooting

### Build Fails
- Check that all environment variables are set in Vercel
- Verify `package.json` has correct build script
- Check Vercel build logs for specific errors

### API Errors
- Verify Supabase Edge Function is deployed
- Check Supabase Edge Function logs
- Verify all secrets are set in Supabase Dashboard

### Payment Errors
- Verify Stripe keys are correct (test vs production)
- Check Stripe dashboard for payment intents
- Verify CORS is configured correctly

## 📝 Ready to Launch!

Once all checks pass, you're ready to launch! 🎉

