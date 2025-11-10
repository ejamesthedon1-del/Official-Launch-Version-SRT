import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { Home, Users, TrendingUp, Award, Shield, Zap } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

const infoCards = [
  {
    icon: Home,
    title: "Property Intelligence",
    description: "Advanced AI analyzes your property's unique characteristics, market position, and competitive advantages to provide actionable insights.",
    stats: "98% Accuracy",
    highlight: "Market-Ready Analysis"
  },
  { 
    icon: Users, 
    title: "Buyer Targeting",
    description: "Identify and understand your ideal buyers with detailed demographic profiles, purchasing power, and motivation factors.",
    stats: "40% Faster Sales",
    highlight: "Precision Marketing"
  },
  {
    icon: TrendingUp,
    title: "Price Optimization", 
    description: "Data-driven pricing strategies based on real market conditions, comparable properties, and demand indicators.",
    stats: "12% Higher Value",
    highlight: "Max ROI Pricing"
  },
  {
    icon: Award,
    title: "Quality Score",
    description: "Comprehensive evaluation of your listing across 10 critical factors that impact selling time and final price.",
    stats: "A+ Rating System",
    highlight: "Professional Grade"
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "Identify potential market risks, timing issues, and competitive threats before they impact your sale.",
    stats: "Risk Mitigated",
    highlight: "Proactive Strategy"
  },
  {
    icon: Zap,
    title: "Action Plans",
    description: "Week-by-week marketing strategies with specific tactics, channels, and messaging tailored to your property.",
    stats: "30-Day Roadmap",
    highlight: "Results Focused"
  }
];

export function SlidingInfoSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    trackMouse: true,
    trackTouch: true,
    delta: 50,
  });

  const handleSwipe = (swipeDirection: 'left' | 'right') => {
    if (swipeDirection === 'left') {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % infoCards.length);
    } else {
      setDirection(-1);
      setCurrentIndex((prev) => (prev - 1 + infoCards.length) % infoCards.length);
    }
  };

  const slideVariants = {
    hiddenRight: {
      x: "100%",
      opacity: 0,
      scale: 0.8,
    },
    hiddenLeft: {
      x: "-100%",
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
    exit: {
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.4,
      },
    },
  };

  const getVisibleCards = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(infoCards[(currentIndex + i) % infoCards.length]);
    }
    return visible;
  };

  const visibleCards = getVisibleCards();

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
            AI-Powered Insights
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Smarter Marketing. 
          <br />
          Quicker Closings.
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          From data to action. SmartRelatorTools 
         <br />
         transforms insights into an easy-to-follow plan.
          </p>
        </div>

        {/* Sliding Cards Container */}
        <div 
          {...handlers}
          className="relative select-none cursor-grab active:cursor-grabbing"
        >
          {/* Desktop View - 3 cards visible */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 mb-8">
            {visibleCards.map((card, index) => {
              const Icon = card.icon;
              const isActive = index === 1; // Middle card is active
              
              return (
                <motion.div
                  key={`${currentIndex}-${index}`}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.05 : 0.95,
                    opacity: isActive ? 1 : 0.7,
                    y: isActive ? -8 : 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  className={index === 1 ? "z-20" : "z-10"}
                >
                  <Card className={`p-8 bg-white border-slate-200 hover:shadow-xl transition-all duration-300 ${
                    isActive ? "shadow-xl border-blue-300" : "shadow-md"
                  }`}>
                    {/* Icon and Stats */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 font-semibold">
                        {card.stats}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="mb-4">
                      <Badge className="mb-3 bg-blue-50 text-blue-700 border-blue-200 text-xs">
                        {card.highlight}
                      </Badge>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">
                        {card.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {card.description}
                      </p>
                    </div>

                    {/* Bottom Accent */}
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mt-4" />
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile View - Single card with swipe */}
          <div className="md:hidden mb-8">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial={direction > 0 ? "hiddenRight" : "hiddenLeft"}
                animate="visible"
                exit="exit"
              >
                <Card className="p-6 bg-white border-slate-200 shadow-xl">
                  {(() => {
                    const card = infoCards[currentIndex];
                    const Icon = card.icon;
                    return (
                      <>
                        <div className="flex items-start justify-between mb-6">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 font-semibold text-xs">
                            {card.stats}
                          </Badge>
                        </div>

                        <div className="mb-4">
                          <Badge className="mb-3 bg-blue-50 text-blue-700 border-blue-200 text-xs">
                            {card.highlight}
                          </Badge>
                          <h3 className="text-lg font-bold text-slate-900 mb-3">
                            {card.title}
                          </h3>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {card.description}
                          </p>
                        </div>

                        <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
                      </>
                    );
                  })()}
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2">
            {infoCards.map((_, index) => (
              <motion.div
                key={index}
                className="h-2 rounded-full bg-slate-300"
                animate={{
                  width: index === currentIndex ? 32 : 8,
                  backgroundColor: index === currentIndex ? "rgb(37 99 235)" : "rgb(203 213 225)",
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Swipe hint for mobile */}
          <div className="md:hidden text-center mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="inline-flex items-center gap-2 text-sm text-slate-500 px-4 py-2 bg-slate-50 rounded-full"
            >
              <motion.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </motion.svg>
              Swipe to navigate
              <motion.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}