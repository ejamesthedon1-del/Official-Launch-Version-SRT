import { useState } from "react";
import { Check, X } from "lucide-react";
import { PaymentForm } from "./PaymentForm";

interface SubscriptionPageProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: "home" | "address-input" | "dashboard" | "marketing-plan" | "subscription") => void;
  onSubscribe?: () => void;
  address?: string;
}

export function SubscriptionPage({ isOpen, onClose, onNavigate, onSubscribe, address = "" }: SubscriptionPageProps) {
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
    onClose();
    onNavigate("marketing-plan");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={onClose}
      />

      {/* Bottom Sheet Modal - Same format as Mobile Menu */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[9999] max-h-[85vh] flex flex-col"
        style={{
          transform: isOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s ease-out",
        }}
      >
        {/* Handle bar at top */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Close button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close subscription"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {/* Header */}
          <div className="pt-2 pb-4">
            <h1
              className="text-black"
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

          {/* Minimalist Subscription Card - Matching Reference Design */}
          <div className="pb-6">
            <div className="max-w-sm mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
              {/* Billing Tabs - At the Very Top */}
              <div className="mb-8">
                <div className="bg-slate-100 rounded-lg p-1 flex gap-1">
                  <button
                    onClick={() => setSelectedDuration("1")}
                    className={`flex-1 rounded-md py-2.5 transition-all ${
                      selectedDuration === "1"
                        ? "bg-slate-200 text-slate-700"
                        : "bg-transparent text-slate-400"
                    }`}
                    style={{ fontSize: "14px", fontWeight: 500 }}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setSelectedDuration("6")}
                    className={`flex-1 rounded-md py-2.5 transition-all ${
                      selectedDuration === "6"
                        ? "bg-slate-200 text-slate-700"
                        : "bg-transparent text-slate-400"
                    }`}
                    style={{ fontSize: "14px", fontWeight: 500 }}
                  >
                    Quarterly (Save 10%)
                  </button>
                </div>
              </div>

              {/* Pricing Display - Large, Bold */}
              <div className="mb-8">
                <div className="text-5xl md:text-6xl font-bold text-black mb-1" style={{ letterSpacing: "-0.02em" }}>
                  {pricing.starter[selectedDuration].price}
                </div>
                <div className="text-sm text-slate-500">one-time</div>
              </div>

              {/* Benefits List - Minimalist Greyed Out Style */}
              <div className="mb-8">
                <div className="space-y-3.5">
                  {features[selectedPlan].map((feature, index) => (
                    <div key={feature.name} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                        <Check className="w-3 h-3 text-slate-300" strokeWidth={2.5} />
                      </div>
                      <div className="text-sm text-slate-400" style={{ fontWeight: 400 }}>
                        {feature.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subscribe Button - Large, Rounded */}
              {!showPayment ? (
                <div className="space-y-2">
                  <button
                    onClick={() => setShowPayment(true)}
                    disabled={selectedPlan === "premium"}
                    className={`w-full py-4 rounded-xl transition-colors ${
                      selectedPlan === "premium"
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    style={{ fontSize: "16px", fontWeight: 600 }}
                  >
                    Subscribe
                  </button>
                  <div className="text-center text-xs text-slate-300" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
                    Secure checkout powered by Stripe
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
    </>
  );
}

