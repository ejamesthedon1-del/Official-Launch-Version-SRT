import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Lock, Crown, CheckCircle, Star, ArrowRight, Zap } from "lucide-react";

interface PaywallProps {
  onSubscribe: () => void;
  onClose?: () => void;
  analysisData?: any;
}

export function Paywall({ onSubscribe, onClose, analysisData }: PaywallProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Gradient overlay - allows partial visibility but not readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-white/95 backdrop-blur-md" />
      
      {/* Modal content - positioned on top of gradient */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Unlock Your Complete Analysis
            </h2>
            <p className="text-xl text-slate-600">
              Get unlimited access to detailed insights and marketing strategies
            </p>
          </div>

          {/* Score Summary */}
          {analysisData && (
            <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <div className="text-center">
                <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">
                  Analysis Complete
                </Badge>
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {analysisData.overallScore || 85}
                </div>
                <div className="text-xl text-slate-600 mb-4">
                  Overall Listing Score
                </div>
                <p className="text-slate-700">
                  {analysisData.insights?.summary || "Your property shows strong potential with targeted improvements."}
                </p>
              </div>
            </Card>
          )}

          {/* Paywall Message */}
          <Card className="p-6 mb-8 border-orange-200 bg-orange-50">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Detailed Insights Require Premium Access</h3>
                <p className="text-slate-600 mb-4">
                  Your complete analysis with detailed ratings, buyer demographics, pricing strategies, and marketing plans are available with our premium plan.
                </p>
              </div>
            </div>
          </Card>

          {/* Pricing Options */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 border-2 border-blue-500 bg-blue-50 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-blue-600 text-white">Popular</Badge>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Monthly Plan</h3>
              <div className="text-3xl font-bold text-slate-900 mb-4">
                $29<span className="text-lg text-slate-600">/month</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Unlimited property analyses
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Detailed factor breakdowns
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Buyer demographic insights
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  30-day marketing plans
                </li>
              </ul>
              <Button 
                onClick={onSubscribe}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Get Monthly Access
              </Button>
            </Card>

            <Card className="p-6 border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-2">One-Time Analysis</h3>
              <div className="text-3xl font-bold text-slate-900 mb-4">
                $49<span className="text-lg text-slate-600">/analysis</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Complete single property report
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  All detailed insights included
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Custom marketing strategy
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Downloadable PDF report
                </li>
              </ul>
              <Button 
                onClick={() => {/* Handle one-time payment */}}
                variant="outline"
                className="w-full"
              >
                One-Time Analysis
              </Button>
            </Card>
          </div>

          {/* Testimonial */}
          <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <div className="flex items-start gap-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div>
                <p className="text-white/90 mb-2 italic">
                  "The premium insights helped me price my property perfectly and it sold in just 12 days!"
                </p>
                <div className="text-sm text-white/80">
                  — Sarah Johnson, Luxury Real Estate Agent
                </div>
              </div>
            </div>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <Button 
              variant="ghost" 
              className="text-slate-500 hover:text-slate-700"
              onClick={() => {
                if (onClose) {
                  onClose();
                }
              }}
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}