# Dashboard Categories and Data Analysis Framework

## Notes

- **Data Sources**: Listing data comes from RentCast API (price, beds, baths, sqft, daysOnMarket, propertyType). AI analysis comes from Gemini API.
- **Score Calculation**: Overall score uses weighted formula: Days on Market (40%), Pricing Strategy (30%), Market Trend (20%), Property Appeal (10%).
- **Focus**: All analysis is focused on "selling faster" - every insight must help accelerate the sale timeline.
- **No External Data**: We do NOT analyze photos, descriptions, or external marketing data - only AI insights and RentCast data for accuracy.

---

## Categories

### 1. Days on Market (DOM)
**What it is**: Number of days the property has been listed for sale.

**What needs to be explained**:
- Critical threshold indicators: ≤14 days (fresh), 15-30 days (healthy), 31-60 days (warning), 60+ days (urgent)
- How DOM directly correlates with pricing issues and buyer perception
- Market-specific DOM benchmarks (what's normal for this area/property type)
- Action triggers: When DOM exceeds thresholds, what specific actions are required
- Impact on overall score: DOM has 40% weight in overall score calculation
- Stale listing psychology: How high DOM affects buyer interest and negotiation power

**Dashboard Display**: Rating card, category score bar chart, radar chart (Speed of Sale), alerts, summary critique

---

### 2. Pricing Strategy
**What it is**: Analysis of whether the current listing price is competitive for fast sale.

**What needs to be explained**:
- Price per sqft comparison to neighborhood/market averages
- Competitive pricing analysis: How the price compares to similar recently sold properties
- Price positioning: Whether priced above, at, or below market value
- Pricing psychology: How price points affect buyer interest and offer speed
- Price reduction recommendations: When DOM > 30, provide exact percentage and dollar amount reductions
- Market-specific pricing strategies: Hot market vs. slow market pricing approaches
- Price elasticity: How price changes typically affect DOM reduction (e.g., 5% reduction = 40-50% DOM reduction)

**Dashboard Display**: Rating card, category score bar chart, radar chart (Pricing), Pricing Strategy section, pricingInsight field, AI Insights card

---

### 3. Market Trend
**What it is**: Current market condition analysis for the specific property location.

**What needs to be explained**:
- Market classification: Hot Market, Stable Market, Slow Market, Buyer's Market, Seller's Market
- Market competitiveness level: How competitive the current market is for this property type
- Speed of sale impact: How the market condition affects how quickly this property will sell
- Seasonal factors: How current season/time of year affects market dynamics
- Local market trends: Neighborhood-specific trends vs. city-wide trends
- Inventory levels: How current inventory affects this property's selling speed
- Buyer demand indicators: What signals indicate strong or weak buyer demand

**Dashboard Display**: Rating card description, category score bar chart, radar chart (Market Position), summary line 1

---

### 4. Property Appeal (Key Features)
**What it is**: Specific features that help the property sell faster and attract quick buyers.

**What needs to be explained**:
- Feature specificity: Concrete, specific features (not generic like "good location")
- Buyer psychology: Which features create emotional appeal and urgency
- Market-specific appeal: Features that matter most for this property type and location
- Competitive advantages: Features that differentiate this property from similar listings
- Feature prioritization: Which features should be highlighted first in marketing
- Missing features: What key features are absent that could accelerate sale
- Feature-to-price alignment: Whether features justify the current price point

**Dashboard Display**: Rating card description, category score bar chart, radar chart (Property Appeal), summary line 1 (if DOM is low)

---

### 5. Overall Score
**What it is**: Weighted composite score (0-100) representing the property's selling speed potential.

**What needs to be explained**:
- Score calculation: Weighted formula breakdown (DOM 40%, Pricing 30%, Market 20%, Appeal 10%)
- Score interpretation: What score ranges mean (90+ excellent, 80-89 very good, 70-79 good, 60-69 fair, <60 needs improvement)
- Score drivers: Which factors are most impacting the current score
- Score improvement: What actions will most improve the score
- Score context: How this score compares to typical listings in the market

**Dashboard Display**: Large circular progress indicator, score label (Excellent/Very Good/Good/Fair/Needs Improvement)

---

### 6. Actionable Recommendations
**What it is**: 4 prioritized recommendations that directly impact speed of sale.

**What needs to be explained**:
- Action verbs: Each recommendation must start with an action verb (Reduce, Highlight, Increase, Address, Optimize)
- Specificity: Include exact numbers, percentages, dollar amounts, and timelines
- Prioritization: Most impactful actions first, based on speed of sale impact
- Implementability: Focus on what the realtor can control and implement
- Urgency indicators: Which recommendations are time-sensitive
- Expected outcomes: What results each recommendation should produce

**Dashboard Display**: AI Insights section (top 4 shown), Top 10 Factors Affecting Selling Time section

---

### 7. Risk Factors
**What it is**: Specific obstacles preventing the property from selling faster.

**What needs to be explained**:
- Data-driven risks: Reference actual numbers from listing data (DOM, price per sqft, etc.)
- Risk prioritization: Most critical risks first
- Risk mitigation: How to address each identified risk
- Market-specific risks: Challenges unique to this property type/location
- Property-specific obstacles: Issues specific to this property
- Risk severity: Which risks are urgent vs. moderate concerns

**Dashboard Display**: Alerts section, summary line 2 (if no DOM issues), Top 10 Factors section

---

### 8. Pricing Insight
**What it is**: Specific pricing recommendation or strategy guidance.

**What needs to be explained**:
- Exact numbers: When DOM > 30, must include specific percentage and dollar amount
- Format: "Reduce price by X% ($Y) to $Z to accelerate sale"
- Alternative strategies: If price reduction isn't recommended, explain pricing positioning strategy
- Market-based guidance: Pricing strategy based on current market conditions
- Timeline: When pricing changes should be implemented
- Expected impact: How pricing changes will affect selling speed

**Dashboard Display**: Pricing Strategy section, AI Insights card, summary line 2, Days on Market alert (if DOM > 30)

---

### 9. Selling Speed Prediction
**What it is**: Realistic estimate of days to sell based on current data.

**What needs to be explained**:
- Current strategy estimate: Days to sell with current approach
- Recommended strategy estimate: Days to sell with recommended actions
- Format: "Likely to sell in X-Y days with current strategy, or A-B days with recommended [specific action]"
- Data basis: What factors (DOM, pricing, market, features) inform the prediction
- Confidence level: How certain the prediction is based on available data
- Comparison: How this prediction compares to market averages

**Dashboard Display**: Selling Speed Prediction section

---

### 10. Category Scores (Bar Chart)
**What it is**: Performance scores (0-100) for each analysis category.

**What needs to be explained**:
- Days on Market: Score based on DOM thresholds (≤14 = 90, ≤30 = 70, ≤60 = 50, >60 = 30)
- Pricing Strategy: Base score 80 (can be enhanced with pricing analysis)
- Market Trend: Base score 70 (can be enhanced with market analysis)
- Property Appeal: Base score 80 (can be enhanced with feature analysis)
- Score improvement: What actions improve each category score

**Dashboard Display**: Market & Listing Performance bar chart

---

### 11. Radar Chart Data
**What it is**: Multi-dimensional visualization of property performance across 4 key areas.

**What needs to be explained**:
- Pricing: Score out of 10 (currently 8, can be dynamic)
- Market Position: Score out of 10 (currently 7, can be dynamic)
- Property Appeal: Score out of 10 (currently 8, can be dynamic)
- Speed of Sale: Score based on DOM (≤14 = 9, ≤30 = 7, ≤60 = 5, >60 = 3)
- Balance: How balanced the property is across all dimensions
- Weak areas: Which dimensions need the most improvement

**Dashboard Display**: Radar chart visualization

---

### 12. Summary (Critique)
**What it is**: Short 1-3 line critique hinting at what needs improvement.

**What needs to be explained**:
- Line 1: What's good about the listing (if DOM is low) or critique (if DOM is high)
- Line 2: Critical improvements needed (DOM issues, pricing problems, risk factors)
- Brevity: Must be 1-3 lines maximum
- Action-oriented: Hints at what we'll help with
- Context-aware: Adapts based on DOM and pricing issues

**Dashboard Display**: Summary box in property header section

---

### 13. Alerts
**What it is**: Urgent warnings and notifications about critical issues.

**What needs to be explained**:
- DOM alerts: Urgent (60+ days) or warning (30-60 days) with specific day counts
- Risk factor alerts: Warnings about specific obstacles
- Action required: What immediate actions are needed
- Severity levels: Error (urgent) vs. warning (moderate)
- Context: Why this alert matters for selling speed

**Dashboard Display**: Alert banners (prominent if DOM > 30), Days on Market alert card

---

### 14. Listing Basic Data
**What it is**: Core property information from RentCast API.

**What needs to be explained**:
- Address: Full property address
- City: Extracted from address
- Property Type: Residential, Condo, Townhouse, etc.
- Price: Current listing price (formatted with $ and commas)
- Price per sqft: Calculated price per square foot
- Beds: Number of bedrooms
- Baths: Number of bathrooms
- Sqft: Square footage (formatted with commas)
- Days on Market: Current DOM count
- Image URL: Property photo from Google Places API (if available)

**Dashboard Display**: Property header section, listing details cards

---

## Data Flow

1. **Input**: User enters address → Google Places Autocomplete → RentCast API lookup
2. **Analysis**: Gemini AI analyzes listing data + market context → Returns JSON with insights
3. **Transformation**: Frontend transforms AI response → Calculates scores, creates alerts, generates summary
4. **Display**: Dashboard renders all categories → User sees complete analysis

---

## Key Principles for Each Category

- **Be Specific**: Never vague or generic - use exact numbers, percentages, dates
- **Be Actionable**: Every insight must lead to a specific action the realtor can take
- **Be Data-Driven**: Reference actual numbers from listing data when available
- **Be Prioritized**: Most impactful insights first
- **Be Realistic**: Predictions and recommendations must be achievable and realistic
- **Focus on Speed**: Every category analysis must connect to selling faster

