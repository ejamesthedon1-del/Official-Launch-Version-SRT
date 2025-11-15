// Update src/App.tsx - Replace the insights interface (around line 40-48) with:

insights: {
  summary: string;
  alerts: Array<{
    type: string;
    title: string;
    message: string;
  }>;
  topPriorities: string[];
  pricingInsight?: string | null;
  sellingSpeedPrediction?: string | null;
};

