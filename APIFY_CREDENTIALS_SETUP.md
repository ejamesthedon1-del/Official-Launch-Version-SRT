# Apify API Keys and Credentials Setup

## Required Apify Credentials

You need **2 credentials** from Apify:

---

## 1. APIFY_API_KEY (API Token)

**What it is**: Your Apify API authentication token

**How to get it**:
1. Go to [Apify Console](https://console.apify.com/)
2. Log in or create an account
3. Navigate to **Settings** → **Integrations** → **API tokens**
4. Click **"Create new token"**
5. Give it a name (e.g., "Smart Realtor Tools Production")
6. Set permissions:
   - ✅ **Read** (to read datasets)
   - ✅ **Write** (to run actors)
   - ✅ **Full** (recommended for simplicity)
7. Copy the token (starts with `apify_api_...`)

**Format**: `apify_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**Where to use**: Set as `APIFY_API_KEY` in Supabase Edge Function secrets

---

## 2. APIFY_ACTOR_ID (Actor Identifier)

**What it is**: The unique identifier for your Realtor.com scraper actor

**How to find it**:
1. Go to your Apify Actor page (the Realtor.com scraper you're using)
2. Look at the URL: `https://console.apify.com/actors/[ACTOR_ID]~[ACTOR_NAME]`
3. The Actor ID is the part before the `~` symbol
4. Or check the Actor's **Settings** page - it shows the Actor ID

**Format Examples**:
- `username/realtor-scraper`
- `tri_angle/real-estate-aggregator`
- `your-username/realtor-com-scraper`

**Where to use**: Set as `APIFY_ACTOR_ID` in Supabase Edge Function secrets

---

## Setting Up in Supabase

### Step 1: Add Secrets to Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions** → **Secrets**
3. Add these two secrets:

```
APIFY_API_KEY = apify_api_your_token_here
APIFY_ACTOR_ID = username/actor-name-here
```

### Step 2: Verify Actor Permissions

Make sure your API token has permission to:
- ✅ Run the specific Actor (your Realtor.com scraper)
- ✅ Read datasets from that Actor
- ✅ Access the Actor's runs

---

## Testing Your Credentials

### Test API Token

```bash
curl -H "Authorization: Bearer YOUR_APIFY_API_KEY" \
  https://api.apify.com/v2/users/me
```

Should return your user info if token is valid.

### Test Actor ID

```bash
curl -H "Authorization: Bearer YOUR_APIFY_API_KEY" \
  https://api.apify.com/v2/acts/YOUR_ACTOR_ID
```

Should return Actor details if ID is correct.

---

## Common Issues

### Issue: "Actor not found"
**Solution**: Check that:
- Actor ID format is correct (username/actor-name)
- Your API token has permission to access that Actor
- The Actor is public or you have access to it

### Issue: "Unauthorized"
**Solution**: Check that:
- API token is correct (starts with `apify_api_`)
- Token hasn't expired
- Token has "Write" or "Full" permissions

### Issue: "Actor run failed"
**Solution**: Check that:
- Actor input parameters are correct
- Actor is not rate-limited
- You have sufficient Apify credits

---

## Security Best Practices

1. **Never commit API keys to git** - Always use environment variables
2. **Use separate tokens** - Create different tokens for dev/prod
3. **Limit permissions** - Only grant necessary permissions
4. **Rotate tokens** - Change tokens periodically
5. **Monitor usage** - Check Apify dashboard for unexpected usage

---

## Example: Finding Your Actor ID

If you're using a Realtor.com scraper from Apify Store:

1. Go to [Apify Store](https://apify.com/store)
2. Search for "Realtor.com" or "real estate"
3. Click on the actor you want to use
4. The Actor ID is shown in the URL and on the actor page
5. Example: If URL is `https://apify.com/tri_angle/real-estate-aggregator`
   - Actor ID = `tri_angle/real-estate-aggregator`

---

## Quick Reference

| Credential | What It Is | Where to Get It | Format |
|------------|------------|-----------------|--------|
| **APIFY_API_KEY** | Authentication token | Apify Console → Settings → API tokens | `apify_api_...` |
| **APIFY_ACTOR_ID** | Actor identifier | Actor page URL or Settings | `username/actor-name` |

---

## Next Steps

1. ✅ Get your Apify API token
2. ✅ Find your Realtor.com scraper Actor ID
3. ✅ Add both to Supabase Edge Function secrets
4. ✅ Test the integration (see APIFY_INTEGRATION_GUIDE.md)
5. ✅ Monitor Apify usage and costs

---

## Need Help?

- Apify API Docs: https://docs.apify.com/platform/integrations/api
- Apify Console: https://console.apify.com/
- Check your Actor's documentation for specific input/output formats

