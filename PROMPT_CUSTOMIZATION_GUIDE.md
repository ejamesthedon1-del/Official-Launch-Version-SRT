# How to Create Your Own AI Prompt for the Dashboard

## Dashboard Outputs Required

Your prompt must return JSON with these exact fields that the dashboard uses:

### Required Fields from Supabase → Dashboard

```json
{
  "propertyType": "string (e.g., 'Residential', 'Condo', 'Townhouse')",
  "estimatedValue": number,
  "estimatedPrice": number,
  "beds": number,
  "baths": number,
  "sqft": number,
  "daysOnMarket": number,
  "marketTrend": "string (used in summary and Market Trend rating)",
  "keyFeatures": ["array of 3-5 strings (used in Property Appeal rating and summary)"],
  "recommendations": ["array of 4 strings (shown in AI Insights section)"],
  "riskFactors": ["array of strings (can be empty [], used in alerts and summary)"],
  "pricingInsight": "string or null (shown in Pricing Strategy section)",
  "sellingSpeedPrediction": "string or null (shown in Selling Speed Prediction section)"
}
```

## How Dashboard Uses Each Field

### 1. `marketTrend`
- **Used in**: Summary (line 1), Market Trend rating description
- **Example**: "Hot Market", "Stable Market", "Slow Market", "Buyer's Market"
- **Tip**: Keep it short (2-4 words) - it appears in the summary box

### 2. `keyFeatures`
- **Used in**: Property Appeal rating, Summary (line 1 if DOM is low)
- **Format**: Array of 3-5 specific features
- **Good**: `["Updated kitchen with quartz countertops", "Large backyard with privacy fence", "Walkable to downtown"]`
- **Bad**: `["Good location", "Nice features", "Modern"]` (too generic)

### 3. `recommendations`
- **Used in**: AI Insights section (top 4 shown)
- **Format**: Array of 4 actionable recommendations
- **Must**: Start with action verb, include numbers/dates when possible
- **Example**: 
  ```json
  [
    "Reduce price by 5% ($25,000) to $475,000 within 7 days",
    "Highlight updated kitchen in listing description",
    "Schedule professional photography for exterior shots",
    "Increase open house frequency to twice weekly"
  ]
  ```

### 4. `riskFactors`
- **Used in**: Alerts section, Summary (line 2 if no DOM issues)
- **Format**: Array of strings (can be empty `[]` if no risks)
- **Example**: `["Price per sqft 15% above neighborhood average", "Limited curb appeal affecting first impressions"]`

### 5. `pricingInsight`
- **Used in**: Pricing Strategy section, AI Insights card, Summary (line 2)
- **Format**: String with specific pricing recommendation
- **If DOM > 30**: Must include exact numbers (percentage, dollar amount, new price)
- **Example**: `"Reduce price by 5% ($25,000) to $475,000 to accelerate sale"`
- **If DOM ≤ 30**: General pricing strategy guidance
- **Example**: `"Current pricing aligns with market. Monitor closely and adjust if no offers in 14 days."`

### 6. `sellingSpeedPrediction`
- **Used in**: Selling Speed Prediction section
- **Format**: String with realistic time estimate
- **Example**: `"Likely to sell in 30-45 days with current strategy, or 15-20 days with recommended price reduction"`

## Prompt Structure Template

Here's the structure you should follow in your Supabase prompt:

```javascript
const prompt = `
[YOUR AI IDENTITY & ROLE]
You are an elite real estate analysis AI focused on helping properties sell faster.

---

[CONTEXT DATA]
${domContext}  // Days on Market urgency context
${listingData} // RentCast API data
${pricingContext} // Pricing analysis if DOM > 30

Address: ${address}

---

[ANALYSIS REQUIREMENTS]

1. MARKET TREND ANALYSIS:
   Return a short 2-4 word market condition description.
   Examples: "Hot Market", "Stable Market", "Slow Market"
   This appears in the summary box, so keep it concise.

2. KEY FEATURES FOR BUYER APPEAL:
   Return 3-5 specific, concrete features.
   Be specific: "Updated kitchen with quartz countertops" not "Nice kitchen"
   These help the property sell faster.

3. ACTIONABLE RECOMMENDATIONS:
   Return exactly 4 recommendations.
   Each must:
   - Start with action verb (Reduce, Highlight, Increase, etc.)
   - Include specific numbers/dates when possible
   - Be prioritized by impact (most impactful first)
   - Focus on speed of sale

4. RISK FACTORS:
   Return array of what's preventing faster sale.
   Can be empty [] if no significant risks.
   Be specific and data-driven.

5. PRICING INSIGHT:
   ${daysOnMarket > 30 
     ? 'MUST include exact numbers: "Reduce price by X% ($Y) to $Z"'
     : 'Provide pricing strategy guidance based on market conditions'
   }

6. SELLING SPEED PREDICTION:
   Return realistic estimate with format:
   "Likely to sell in X-Y days with current strategy, or A-B days with recommended [action]"

---

Return ONLY valid JSON (no markdown, no code blocks):

{
  "propertyType": "${listingData.propertyType || 'Residential'}",
  "estimatedValue": ${listingData.price || 0},
  "estimatedPrice": ${listingData.price || 0},
  "beds": ${listingData.beds || 0},
  "baths": ${listingData.baths || 0},
  "sqft": ${listingData.sqft || 0},
  "daysOnMarket": ${listingData.daysOnMarket || 0},
  "marketTrend": "2-4 word market condition",
  "keyFeatures": ["specific feature 1", "specific feature 2", "specific feature 3", "specific feature 4", "specific feature 5"],
  "recommendations": [
    "Priority 1: Action verb + specific numbers",
    "Priority 2: Action verb + specific numbers",
    "Priority 3: Action verb + specific numbers",
    "Priority 4: Action verb + specific numbers"
  ],
  "riskFactors": ["specific risk 1", "specific risk 2"] or [],
  "pricingInsight": "${daysOnMarket > 30 ? 'Exact pricing recommendation with numbers' : 'Pricing strategy guidance'}",
  "sellingSpeedPrediction": "Realistic time estimate with current vs recommended strategy"
}
`;
```

## Key Tips for Customizing Your Prompt

### 1. Keep `marketTrend` Short
- It appears in the summary box (line 1)
- Dashboard shows: `"${marketTrend}. ${daysOnMarket > 30 ? 'X days on market.' : ''}"`
- **Good**: "Hot Market", "Stable Market"
- **Bad**: "This is a hot market with high buyer demand and low inventory"

### 2. Make `keyFeatures` Specific
- Used in summary line 1 if DOM is low
- Dashboard shows: `"Strong features: ${keyFeatures.slice(0, 2).join(', ')}"`
- **Good**: `["Updated kitchen with quartz countertops", "Large backyard"]`
- **Bad**: `["Good location", "Nice features"]`

### 3. Prioritize `recommendations` by Impact
- Dashboard shows top 4 in AI Insights section
- Most impactful should be first
- Always include specific numbers/dates

### 4. Use `riskFactors` for Summary Line 2
- If no DOM issues, dashboard uses first riskFactor for line 2
- Make it actionable and specific

### 5. `pricingInsight` Format Matters
- Dashboard checks if it includes "reduce" for summary line 2
- If DOM > 30, MUST include exact numbers
- Format: "Reduce price by X% ($Y) to $Z to accelerate sale"

### 6. `sellingSpeedPrediction` Should Be Realistic
- Shown in dedicated Selling Speed Prediction section
- Include both current strategy and recommended strategy estimates

## Example: Custom Prompt Section

If you want to change how the AI analyzes, modify the ANALYSIS REQUIREMENTS section:

```javascript
ANALYSIS REQUIREMENTS:

1. MARKET TREND ANALYSIS:
   [YOUR CUSTOM INSTRUCTIONS HERE]
   Return: Short 2-4 word description

2. KEY FEATURES FOR BUYER APPEAL:
   [YOUR CUSTOM INSTRUCTIONS HERE]
   Return: 3-5 specific features

... (continue for all 6 requirements)
```

## Testing Your Prompt

After updating Supabase with your custom prompt:

1. Test with a property that has DOM > 30 (should show pricing recommendation)
2. Test with a property that has DOM ≤ 14 (should show positive summary)
3. Verify all 6 fields are returned in JSON
4. Check that `marketTrend` is short (2-4 words)
5. Verify `recommendations` has exactly 4 items
6. Ensure `pricingInsight` has numbers if DOM > 30

## Where to Edit

1. **Supabase Edge Function**: `supabase/functions/make-server-52cdd920/index.ts`
2. **Find**: The `const prompt = \`...\`` section (around line 290)
3. **Edit**: The ANALYSIS REQUIREMENTS section and JSON template
4. **Keep**: The JSON structure exactly as shown above (field names must match)

## Current Prompt Location

See `SUPABASE_COMPLETE_CODE.md` for the full current prompt structure.

