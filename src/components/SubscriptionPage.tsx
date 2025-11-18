import { motion } from "framer-motion";
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
      "1": { price: "$1", period: "one-time", total: "$1" },
      "6": { price: "$1", period: "one-time", total: "$1" },
      "12": { price: "$1", period: "one-time", total: "$1" },
    },
    premium: {
      "1": { price: "$1", period: "one-time", total: "$1" },
      "6": { price: "$1", period: "one-time", total: "$1" },
      "12": { price: "$1", period: "one-time", total: "$1" },
    },
  };

  const currentPrice = pricing[selectedPlan][selectedDuration];
  const amount = 1; // One-time payment for starter

  const handlePaymentSuccess = () => {
    if (onSubscribe) {
      onSubscribe();
    }
    onNavigate("marketing-plan");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-4 pt-4 pb-6">
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-1 text-blue-600 -ml-1 hover:text-blue-700 transition-colors"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            <ChevronLeft className="w-5 h-5" />
            <span style={{ fontSize: "17px", fontWeight: 400 }}>Back</span>
          </button>
          <h1
            className="mt-4 text-black"
            style={{
              fontSize: "34px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: "41px",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            Manage Subscription
          </h1>
        </div>

        {/* Current Plan Info */}
        <div className="px-4 mb-6">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="text-gray-500" style={{ fontSize: "13px", fontWeight: 400, fontFamily: "system-ui, -apple-system, sans-serif" }}>
              SMART REALTOR TOOLS
            </div>
            <div className="mt-1 text-black" style={{ fontSize: "17px", fontWeight: 600, fontFamily: "system-ui, -apple-system, sans-serif" }}>
              Get your complete marketing plan
            </div>
            <div className="mt-1 text-gray-600" style={{ fontSize: "15px", fontWeight: 400, fontFamily: "system-ui, -apple-system, sans-serif" }}>
              Increase sale probability from 40% to 85% in 30 days
            </div>
          </div>
        </div>

        {/* Change Plan Section */}
        <div className="px-4 mb-2">
          <h2
            className="text-black mb-3"
            style={{
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            Choose Your Plan
          </h2>

          {/* Segmented Control */}
          <div className="bg-gray-100 rounded-xl p-1 flex gap-1 relative">
            <button
              onClick={() => setSelectedPlan("starter")}
              className={`flex-1 rounded-lg py-2 transition-all ${
                selectedPlan === "starter"
                  ? "bg-white text-black shadow-sm"
                  : "bg-transparent text-gray-600"
              }`}
              style={{ fontSize: "15px", fontWeight: 600, fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              Starter
            </button>
            <button
              disabled
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="flex-1 rounded-lg py-2 transition-all bg-transparent text-gray-400 relative cursor-not-allowed opacity-60"
              style={{ fontSize: "15px", fontWeight: 600, fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              Premium
              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg px-2 py-0.5 border border-gray-200 shadow-sm">
                  <span className="text-[10px] font-semibold text-gray-600 tracking-wide" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
                    COMING SOON
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Features List */}
        <div className="px-4 py-6">
          <div className="space-y-4">
            {features[selectedPlan].map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
                <div>
                  <div
                    className="text-black"
                    style={{
                      fontSize: "17px",
                      fontWeight: 600,
                      lineHeight: "22px",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                  >
                    {feature.name}
                  </div>
                  <div
                    className="text-gray-600 mt-0.5"
                    style={{
                      fontSize: "15px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                  >
                    {feature.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        {selectedPlan === "starter" && (
          <div className="px-4 pb-6">
            <div className="w-full text-left rounded-2xl p-4 bg-blue-50 border-2 border-blue-500 shadow-lg shadow-blue-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-blue-500 bg-blue-500">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <div>
                    <div className="text-black" style={{ fontSize: "17px", fontWeight: 600, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                      One-Time Payment
                    </div>
                    <div className="text-gray-600" style={{ fontSize: "13px", fontWeight: 400, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                      Full access • No subscription
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-black" style={{ fontSize: "17px", fontWeight: 700, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                    $1
                  </div>
                  <div className="text-gray-500" style={{ fontSize: "13px", fontWeight: 400, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                    one-time
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedPlan === "premium" && (
          <div className="px-4 pb-6">
            <div className="w-full text-left rounded-2xl p-4 bg-gray-50 border-2 border-gray-200 relative overflow-hidden">
              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="bg-white rounded-xl px-4 py-2 border border-gray-200 shadow-lg">
                  <div className="text-center">
                    <div className="text-gray-900 font-semibold mb-1" style={{ fontSize: "15px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
                      Coming Soon
                    </div>
                    <div className="text-gray-500" style={{ fontSize: "13px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
                      Premium features launching soon
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between opacity-40">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-gray-300 bg-gray-200">
                  </div>
                  <div>
                    <div className="text-black" style={{ fontSize: "17px", fontWeight: 600, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                      Premium Plan
                    </div>
                    <div className="text-gray-600" style={{ fontSize: "13px", fontWeight: 400, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                      Advanced features
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-black" style={{ fontSize: "17px", fontWeight: 700, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                    —
                  </div>
                  <div className="text-gray-500" style={{ fontSize: "13px", fontWeight: 400, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                    —
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Section */}
        {!showPayment ? (
          <div className="px-4 pb-8 pt-4">
            <button
              onClick={() => setShowPayment(true)}
              disabled={selectedPlan === "premium"}
              className={`w-full py-4 rounded-full shadow-lg transition-colors ${
                selectedPlan === "premium"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              <span style={{ fontSize: "17px", fontWeight: 600, letterSpacing: "-0.01em" }}>
                Subscribe for $1
              </span>
            </button>
            <div className="text-center mt-3 text-gray-500" style={{ fontSize: "13px", fontWeight: 400, fontFamily: "system-ui, -apple-system, sans-serif" }}>
              Cancel anytime. No questions asked.
            </div>
          </div>
        ) : (
          <div className="px-4 pb-8 pt-4">
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
  );
}

