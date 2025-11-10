# How to Check Available Gemini Models

## Option 1: Test via API (Recommended)

You can check which models your API key supports by calling the ListModels endpoint:

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_GEMINI_API_KEY"
```

This will return a list of all available models and their supported methods.

## Option 2: Try Common Model Names

The most commonly available models are:

1. **`gemini-pro`** - Older stable version (most widely available)
2. **`gemini-1.5-pro`** - Newer pro version
3. **`gemini-1.5-flash`** - Flash version (without version suffix)
4. **`gemini-1.5-pro-latest`** - Latest pro version

## Option 3: Check Google AI Studio

1. Go to https://makersuite.google.com/app/apikey
2. Check which models are available in the interface
3. Look at the model dropdown in the playground

## Current Code Uses

The code is currently set to use `gemini-pro` which is the most stable and widely available model.

If you want to try a different model, change this line in your Edge Function:

```typescript
const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/MODEL_NAME:generateContent?key=${apiKey}`;
```

Replace `MODEL_NAME` with one of:
- `gemini-pro` (current - most stable)
- `gemini-1.5-pro`
- `gemini-1.5-flash`
- `gemini-1.5-pro-latest`

