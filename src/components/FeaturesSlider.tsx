import { useState, useEffect } from "react";
import { Brain, Target, Clock, DollarSign, TrendingUp, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "./ui/card";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Get instant AI ratings across 10 critical factors that impact your listing's selling time",
  },
  {
    icon: Target,
    title: "Buyer Demographics",
    description:
      "Detailed profiles of your ideal buyers with income levels, motivations, and value drivers",
  },
  {
    icon: Clock,
    title: "30-Day Action Plan",
    description:
      "Week-by-week marketing strategy designed to sell your listing faster",
  },
  {
    icon: DollarSign,
    title: "Price Optimization",
    description:
      "Data-driven pricing recommendations to maximize sale price and reduce market time",
  },
  {
    icon: TrendingUp,
    title: "Investment Analysis",
    description:
      "ROI projections and rental income documentation to attract investor buyers",
  },
  {
    icon: Zap,
    title: "Marketing Strategy",
    description:
      "Tailored marketing plans with targeting, messaging, and channel recommendations",
  },
];

export function FeaturesSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  // Get visible features (current and next two)
  const getVisibleFeatures = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(features[(currentIndex + i) % features.length]);
    }
    return visible;
  };

  const visibleFeatures = getVisibleFeatures();

  return (
    <div className="relative">
      {/* Desktop View - 3 cards */}
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        {visibleFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={`${currentIndex}-${index}`}
              className="p-6 bg-white border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all animate-in fade-in slide-in-from-right-5 duration-500"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-slate-900 font-semibold">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </Card>
          );
        })}
      </div>

      {/* Mobile View - 1 card */}
      <div className="md:hidden">
        <Card className="p-6 bg-white border-slate-200 shadow-lg">
          {(() => {
            const feature = features[currentIndex];
            const Icon = feature.icon;
            return (
              <>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="mb-2 text-slate-900 font-semibold">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </>
            );
          })()}
        </Card>
      </div>

      {/* Navigation Arrows */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={goToPrev}
          className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 text-blue-600" />
        </button>

        {/* Dots Indicator */}
        <div className="flex gap-2">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-blue-600 w-8"
                  : "bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      {/* Auto-play indicator */}
      <div className="text-center mt-4">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
        >
          {isAutoPlaying ? "⏸ Pause" : "▶ Play"} Auto-scroll
        </button>
      </div>
    </div>
  );
}