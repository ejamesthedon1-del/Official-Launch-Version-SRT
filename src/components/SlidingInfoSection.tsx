import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Home, Users, TrendingUp, Award, Shield, Zap } from "lucide-react";
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
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % infoCards.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % infoCards.length);
  };

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + infoCards.length) % infoCards.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  // Get visible cards (show 3 on desktop, 1 on mobile)
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
            Transform Your Real Estate Strategy
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Harness the power of artificial intelligence to analyze properties, target buyers, and optimize your selling approach with data-driven precision.
          </p>
        </div>

        {/* Sliding Cards Container */}
        <div className="relative">
          {/* Desktop View - 3 cards sliding */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 mb-8">
            {visibleCards.map((card, index) => {
              const Icon = card.icon;
              const delay = index * 100;
              
              return (
                <Card
                  key={`${currentIndex}-${index}`}
                  className={`p-8 bg-white border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all duration-500 animate-in fade-in slide-in-from-right-5`}
                  style={{ animationDelay: `${delay}ms` }}
                >
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
              );
            })}
          </div>

          {/* Mobile View - 1 card sliding */}
          <div className="md:hidden mb-8">
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
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-6">
            {/* Previous Button */}
            <button
              onClick={goToPrev}
              className="w-12 h-12 rounded-full bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600 hover:text-blue-600" />
            </button>

            {/* Progress Dots */}
            <div className="flex gap-2">
              {infoCards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-blue-600 w-8"
                      : "bg-slate-300 hover:bg-slate-400 w-2"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="w-12 h-12 rounded-full bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6 text-slate-600 hover:text-blue-600" />
            </button>
          </div>

          {/* Auto-play Control */}
          <div className="text-center mt-6">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-2 mx-auto"
            >
              {isAutoPlaying ? (
                <>
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                  Auto-playing
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-slate-400 rounded-full" />
                  Paused
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}