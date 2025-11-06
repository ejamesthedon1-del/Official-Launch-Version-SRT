import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowRight, Lock, Eye, BarChart3, TrendingUp, Target } from "lucide-react";

interface LockedDashboardProps {
  onAnalyze: () => void;
}

export function LockedDashboard({ onAnalyze }: LockedDashboardProps) {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Locked Dashboard Preview */}
          <div className="relative">
            {/* Blurred Background */}
            <div className="backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 opacity-60">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/50 rounded-lg p-6 border border-slate-200">
                      <div className="h-4 bg-slate-300 rounded mb-4 w-3/4"></div>
                      <div className="h-8 bg-slate-300 rounded mb-3"></div>
                      <div className="h-3 bg-slate-200 rounded mb-2 w-full"></div>
                      <div className="h-3 bg-slate-200 rounded mb-2 w-5/6"></div>
                      <div className="h-3 bg-slate-200 rounded w-4/6"></div>
                    </div>
                  ))}
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/50 rounded-lg p-6 border border-slate-200">
                    <div className="h-6 bg-slate-300 rounded mb-4 w-1/2"></div>
                    <div className="h-32 bg-slate-200 rounded"></div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-6 border border-slate-200">
                    <div className="h-6 bg-slate-300 rounded mb-4 w-1/2"></div>
                    <div className="h-32 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lock Overlay */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-center max-w-md mx-4"
              >
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <Lock className="w-10 h-10 text-white" />
                </motion.div>
                
                <motion.h2
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="text-2xl font-bold text-slate-900 mb-4"
                >
                  Analyze your first listing free
                </motion.h2>
                
                <motion.p
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="text-slate-600 mb-8"
                >
                  Get instant AI-powered analysis of your property listing with detailed insights, pricing recommendations, and marketing strategies.
                </motion.p>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <Button
                    size="lg"
                    onClick={onAnalyze}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg px-8 py-3"
                  >
                    Analyze My Listing Free <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="mt-6 space-y-2 text-sm text-slate-500"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>Complete analysis in seconds</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Feature Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="mt-12"
          >
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">What You'll Get</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">AI Score & Analysis</h4>
                    <p className="text-sm text-slate-600">Comprehensive property evaluation with actionable insights</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Price Optimization</h4>
                    <p className="text-sm text-slate-600">Data-driven pricing recommendations for maximum value</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}