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
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "premium">("premium");
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
      "1": { price: "$9.99", period: "month", total: "$9.99" },
      "6": { price: "$7.99", period: "month", total: "$47.94", save: "20%" },
      "12": { price: "$6.99", period: "month", total: "$83.88", save: "30%" },
    },
    premium: {
      "1": { price: "$1", period: "one-time", total: "$1" },
      "6": { price: "$1", period: "one-time", total: "$1" },
      "12": { price: "$1", period: "one-time", total: "$1" },
    },
  };

  const currentPrice = pricing[selectedPlan][selectedDuration];
  const amount = selectedPlan === "premium" ? 1 : parseFloat(pricing.starter[selectedDuration].price.replace("$", ""));

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
          <div className="bg-gray-100 rounded-xl p-1 flex gap-1">
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
              onClick={() => setSelectedPlan("premium")}
              className={`flex-1 rounded-lg py-2 transition-all ${
                selectedPlan === "premium"
                  ? "bg-white text-black shadow-sm"
                  : "bg-transparent text-gray-600"
              }`}
              style={{ fontSize: "15px", fontWeight: 600, fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              Premium
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
        {selectedPlan === "premium" ? (
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
        ) : (
          <div className="px-4 pb-6">
            <div className="space-y-3">
              {/* 1 Month */}
              <button
                onClick={() => setSelectedDuration("1")}
                className={`w-full text-left rounded-2xl p-4 transition-all ${
                  selectedDuration === "1"
                    ? "bg-blue-50 border-2 border-blue-500 shadow-lg shadow-blue-500/10"
                    : "bg-white border-2 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedDuration === "1" ? "border-blue-500 bg-blue-500" : "border-gray-300"
                      }`}
                    >
                      {selectedDuration === "1" && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <div>
                      <div className="text-black" style={{ fontSize: "17px", fontWeight: 600, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                        1 Month
                      </div>
                      <div className="text-gray-600" style={{ fontSize: "13px", fontWeight: 400, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                        {pricing.starter["1"].total}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-black" style={{ fontSize: "17px", fontWeight: 700, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                      {pricing.starter["1"].price}
                    </div>
                    <div className="text-gray-500" style={{ fontSize: "13px", fontWeight: 400, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                      per month
                    </div>
                  </div>
                </div>
              </button>

              {/* 6 Months - Popular */}
              <button
                onClick={() => setSelectedDuration("6")}
                className={`w-full text-left rounded-2xl p-4 transition-all relative ${
                  selectedDuration === "6"
                    ? "bg-blue-50 border-2 border-blue-500 shadow-lg shadow-blue-500/10"
                    : "bg-white border-2 border-gray-200"
                }`}
              >
                {/* Popular Badge */}
                <div className="absolute -top-2 left-4">
                  <div className="bg-blue-500 text-white px-3 py-0.5 rounded-full" style={{ fontSize: "11px", fontWeight: 700, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                    POPULAR
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedDuration === "6" ? "border-blue-500 bg-blue-500" : "border-gray-300"
                      }`}
                    >
                      {selectedDuration === "6" && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <div>
                      <div className="text-black" style={{ fontSize: "17px", fontWeight: 600, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                        6 Months
                      </div>
                      <div className="text-gray-600" style={{ fontSize: "13px", fontWeight: 400, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                        {pricing.starter["6"].total} total
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <div className="text-black" style={{ fontSize: "17px", fontWeight: 700, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                        {pricing.starter["6"].price}
                      </div>
                      <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded-md" style={{ fontSize: "11px", fontWeight: 700, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                        Save {pricing.starter["6"].save}
                      </div>
                    </div>
                    <div className="text-gray-500" style={{ fontSize: "13px", fontWeight: 400, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                      per month
                    </div>
                  </div>
                </div>
              </button>

              {/* 12 Months */}
              <button
                onClick={() => setSelectedDuration("12")}
                className={`w-full text-left rounded-2xl p-4 transition-all ${
                  selectedDuration === "12"
                    ? "bg-blue-50 border-2 border-blue-500 shadow-lg shadow-blue-500/10"
                    : "bg-white border-2 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedDuration === "12" ? "border-blue-500 bg-blue-500" : "border-gray-300"
                      }`}
                    >
                      {selectedDuration === "12" && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <div>
                      <div className="text-black" style={{ fontSize: "17px", fontWeight: 600, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                        12 Months
                      </div>
                      <div className="text-gray-600" style={{ fontSize: "13px", fontWeight: 400, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                        {pricing.starter["12"].total} total
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <div className="text-black" style={{ fontSize: "17px", fontWeight: 700, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                        {pricing.starter["12"].price}
                      </div>
                      <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded-md" style={{ fontSize: "11px", fontWeight: 700, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                        Save {pricing.starter["12"].save}
                      </div>
                    </div>
                    <div className="text-gray-500" style={{ fontSize: "13px", fontWeight: 400, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                      per month
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Payment Section */}
        {!showPayment ? (
          <div className="px-4 pb-8 pt-4">
            <button
              onClick={() => setShowPayment(true)}
              className="w-full bg-blue-600 text-white py-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              <span style={{ fontSize: "17px", fontWeight: 600, letterSpacing: "-0.01em" }}>
                {selectedPlan === "premium"
                  ? "Subscribe for $1"
                  : `Subscribe for ${selectedDuration === "1" ? "1 Month" : selectedDuration === "6" ? "6 Months" : "12 Months"}`}
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

