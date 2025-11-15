// Replace the transformAnalysisData function in src/components/AddressInput.tsx
// Replace lines 30-122 with this:

function transformAnalysisData(address: string, geminiData: any): any {
  if (geminiData.listing && geminiData.overallScore) {
    if (geminiData.propertyImageUrl) {
      geminiData.listing.imageUrl = geminiData.propertyImageUrl;
    }
    return geminiData;
  }

  const addressParts = address.split(",");
  const city = addressParts.length > 1 ? addressParts[addressParts.length - 2]?.trim() || "Unknown" : "Unknown";

  const estimatedValue = geminiData.estimatedPrice || geminiData.estimatedValue || 0;
  
  const parseNumber = (value: any, defaultValue: number = 0): number => {
    if (typeof value === 'number' && !isNaN(value)) return Math.max(0, value);
    if (value === null || value === undefined) return defaultValue;
    const parsed = parseFloat(value);
    return !isNaN(parsed) ? Math.max(0, parsed) : defaultValue;
  };
  
  const beds = Math.round(parseNumber(geminiData.beds, 0));
  const baths = parseNumber(geminiData.baths, 0);
  const sqft = Math.round(parseNumber(geminiData.sqft, 0));
  const daysOnMarket = Math.round(parseNumber(geminiData.daysOnMarket, 0));
  
  const pricePerSqft = sqft > 0 && estimatedValue > 0 ? Math.round(estimatedValue / sqft) : 0;
  
  return {
    listing: {
      address: address,
      city: city,
      propertyType: geminiData.propertyType || "Residential",
      price: estimatedValue > 0 ? `$${estimatedValue.toLocaleString()}` : "Price not available",
      pricePerSqft: pricePerSqft > 0 ? `$${pricePerSqft.toLocaleString()}` : "N/A",
      beds: beds,
      baths: baths,
      sqft: sqft > 0 ? sqft.toLocaleString() : "N/A",
      daysOnMarket: daysOnMarket,
      imageUrl: geminiData.propertyImageUrl || null
    },
    overallScore: 75,
    ratings: [
      {
        title: "Days on Market",
        score: daysOnMarket <= 14 ? 9 : daysOnMarket <= 30 ? 7 : daysOnMarket <= 60 ? 5 : 3,
        maxScore: 10,
        category: "Speed",
        description: `${daysOnMarket} days on market${daysOnMarket > 30 ? ' - Above average, action recommended' : daysOnMarket > 60 ? ' - High DOM, urgent action needed' : ''}`
      },
      {
        title: "Pricing Strategy",
        score: 8,
        maxScore: 10,
        category: "Pricing",
        description: geminiData.pricingInsight || "Pricing analysis available"
      },
      {
        title: "Market Trend",
        score: 7,
        maxScore: 10,
        category: "Market",
        description: geminiData.marketTrend || "Stable market"
      },
      {
        title: "Property Appeal",
        score: 8,
        maxScore: 10,
        category: "Features",
        description: geminiData.keyFeatures?.join(", ") || "Standard features"
      }
    ],
    categoryScores: [
      { category: "Days on Market", score: daysOnMarket <= 14 ? 90 : daysOnMarket <= 30 ? 70 : daysOnMarket <= 60 ? 50 : 30 },
      { category: "Pricing Strategy", score: 80 },
      { category: "Market Trend", score: 70 },
      { category: "Property Appeal", score: 80 }
    ],
    radarData: [
      { subject: "Pricing", A: 8, fullMark: 10 },
      { subject: "Market Position", A: 7, fullMark: 10 },
      { subject: "Property Appeal", A: 8, fullMark: 10 },
      { subject: "Speed of Sale", A: daysOnMarket <= 14 ? 9 : daysOnMarket <= 30 ? 7 : daysOnMarket <= 60 ? 5 : 3, fullMark: 10 }
    ],
    insights: {
      summary: `Analysis for ${address}. ${geminiData.marketTrend || "Market conditions are stable"}. ${daysOnMarket > 30 ? `Property has been on market ${daysOnMarket} days - action recommended.` : ''} ${geminiData.keyFeatures?.join(", ") || "Standard property features"}.`,
      alerts: [
        ...(daysOnMarket > 60 ? [{
          type: "error",
          title: "Urgent: High Days on Market",
          message: `Property has been on market ${daysOnMarket} days (60+ days). Immediate pricing or positioning action required.`
        }] : []),
        ...(daysOnMarket > 30 && daysOnMarket <= 60 ? [{
          type: "warning",
          title: "Warning: Above Average Days on Market",
          message: `Property has been on market ${daysOnMarket} days (above 30-day threshold). Consider pricing strategy review.`
        }] : []),
        ...(geminiData.riskFactors?.map((risk: string) => ({
          type: "warning",
          title: "Risk Factor",
          message: risk
        })) || [])
      ],
      topPriorities: geminiData.recommendations || ["Review property details", "Check market conditions"],
      pricingInsight: geminiData.pricingInsight || null,
      sellingSpeedPrediction: geminiData.sellingSpeedPrediction || null
    }
  };
}

