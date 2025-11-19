import { useState } from "react";
import { Check, ChevronLeft } from "lucide-react";
import { PaymentForm } from "./PaymentForm";

interface SubscriptionPageProps {
  onNavigate: (view: "home" | "address-input" | "dashboard" | "marketing-plan" | "subscription") => void;
  onSubscribe?: () => void;
  address?: string;
}

export function SubscriptionPage({ onNavigate, onSubscribe, address = "" }: SubscriptionPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "premium">("starter");
  const [selectedDuration, setSelectedDuration] = useState<"1" | "6" | "12">("6");
  const [showPayment, setShowPayment] = useState(false);

  const features = {
    starter: [
      { name: "Basic Property Analysis", description: "Get instant property insights" },
      { name: "Market Data Access", description: "View recent sales and trends" },
      { name: "Email Support", description: "Get help within 24 hours" },
      { name: "5 Reports per Month", description: "Generate detailed property reports" },
    ],
    premium: [
      { name: "AI Listing Score", description: "Evaluate your property instantly" },
      { name: "Complete 30-Day Action Plan", description: "Week-by-week marketing strategy" },
      { name: "Target Buyer Demographic Profiles", description: "4 detailed buyer personas" },
      { name: "Investment ROI Documentation", description: "Templates and projections" },
      { name: "Rental Income Projection Models", description: "Detailed financial analysis" },
      { name: "Strategic Price Positioning", description: "AI-powered pricing insights" },
      { name: "Priority Support", description: "Get help within 1 hour" },
      { name: "Unlimited Reports", description: "Generate as many as you need" },
    ],
  };

  const pricing = {
    starter: {
      "1": { price: "$9.99", period: "one-time", total: "$9.99", originalPrice: "$49.99" },
      "6": { price: "$9.99", period: "one-time", total: "$9.99", originalPrice: "$49.99" },
      "12": { price: "$9.99", period: "one-time", total: "$9.99", originalPrice: "$49.99" },
    },
    premium: {
      "1": { price: "$1", period: "one-time", total: "$1" },
      "6": { price: "$1", period: "one-time", total: "$1" },
      "12": { price: "$1", period: "one-time", total: "$1" },
    },
  };

  const currentPrice = pricing[selectedPlan][selectedDuration];
  const amount = 9.99; // One-time payment for starter

  const handlePaymentSuccess = () => {
    if (onSubscribe) {
      onSubscribe();
    }
    onNavigate("marketing-plan");
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <div className="max-w-md mx-auto w-full h-full flex flex-col overflow-hidden">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="px-4 pt-3 pb-3 md:pt-4 md:pb-6">
            <button
              onClick={() => onNavigate("dashboard")}
              className="flex items-center gap-1 text-blue-600 -ml-1 hover:text-blue-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span style={{ fontSize: "17px", fontWeight: 400 }}>Back</span>
            </button>
            <h1
              className="mt-2 md:mt-4 text-black"
              style={{
                fontSize: "28px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: "34px",
              }}
            >
              Manage subscription
            </h1>
          </div>

          {/* Minimalist Subscription Card */}
          <div className="px-4 pb-8">
            <div className="max-w-sm mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
              {/* Pricing Section - Top */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-2xl md:text-3xl font-bold text-slate-400 line-through">
                    {pricing.starter["1"].originalPrice}
                  </span>
                  <span className="text-4xl md:text-5xl font-bold text-blue-600">
                    {pricing.starter["1"].price}
                  </span>
                </div>
                <div className="text-sm text-slate-600 mb-1">one-time</div>
                <div className="text-xs text-slate-500">Full access • No subscription</div>
              </div>

              {/* Billing Tabs - Monthly/Quarterly */}
              <div className="mb-6">
                <div className="bg-slate-100 rounded-xl p-1 flex gap-1">
                  <button
                    onClick={() => setSelectedDuration("1")}
                    className={`flex-1 rounded-lg py-2 transition-all ${
                      selectedDuration === "1"
                        ? "bg-white text-black shadow-sm"
                        : "bg-transparent text-slate-600"
                    }`}
                    style={{ fontSize: "14px", fontWeight: 600 }}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setSelectedDuration("6")}
                    className={`flex-1 rounded-lg py-2 transition-all ${
                      selectedDuration === "6"
                        ? "bg-white text-black shadow-sm"
                        : "bg-transparent text-slate-600"
                    }`}
                    style={{ fontSize: "14px", fontWeight: 600 }}
                  >
                    Quarterly
                  </button>
                </div>
              </div>

              {/* Benefits List - Minimalist Greyed Out Style */}
              <div className="mb-6">
                <div className="space-y-3">
                  {features[selectedPlan].map((feature, index) => (
                    <div key={feature.name} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center mt-0.5 opacity-60">
                        <Check className="w-2.5 h-2.5 text-slate-500" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-slate-700 opacity-70" style={{ fontWeight: 500 }}>
                          {feature.name}
                        </div>
                        <div className="text-xs text-slate-500 opacity-60 mt-0.5">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subscribe Button - Bottom */}
              {!showPayment ? (
                <div className="space-y-2">
                  <button
                    onClick={() => setShowPayment(true)}
                    disabled={selectedPlan === "premium"}
                    className={`w-full py-4 rounded-xl shadow-sm transition-colors ${
                      selectedPlan === "premium"
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    style={{ fontSize: "16px", fontWeight: 600 }}
                  >
                    Subscribe for {pricing.starter[selectedDuration].price}
                  </button>
                  <div className="text-center text-xs text-slate-500">
                    Cancel anytime. No questions asked.
                  </div>
                </div>
              ) : (
                <div>
                  <PaymentForm
                    amount={amount}
                    address={address}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setShowPayment(false)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

