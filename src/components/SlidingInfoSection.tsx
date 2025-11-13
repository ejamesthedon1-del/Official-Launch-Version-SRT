import { Home, Users, TrendingUp, Award, Shield, Zap } from "lucide-react";
import { Badge } from "./ui/badge";

const infoCards = [
  {
    icon: Home,
    title: "Property Intelligence",
    description: "Advanced AI analyzes your property's unique characteristics, market position, and competitive advantages to provide actionable insights.",
    stats: "98% Accuracy",
    highlight: "Market-Ready Analysis",
    color: "from-blue-500 to-cyan-500"
  },
  { 
    icon: Users, 
    title: "Buyer Targeting",
    description: "Identify and understand your ideal buyers with detailed demographic profiles, purchasing power, and motivation factors.",
    stats: "40% Faster Sales",
    highlight: "Precision Marketing",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: TrendingUp,
    title: "Price Optimization", 
    description: "Data-driven pricing strategies based on real market conditions, comparable properties, and demand indicators.",
    stats: "12% Higher Value",
    highlight: "Max ROI Pricing",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Award,
    title: "Quality Score",
    description: "Comprehensive evaluation of your listing across 10 critical factors that impact selling time and final price.",
    stats: "A+ Rating System",
    highlight: "Professional Grade",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "Identify potential market risks, timing issues, and competitive threats before they impact your sale.",
    stats: "Risk Mitigated",
    highlight: "Proactive Strategy",
    color: "from-indigo-500 to-blue-500"
  },
  {
    icon: Zap,
    title: "Action Plans",
    description: "Week-by-week marketing strategies with specific tactics, channels, and messaging tailored to your property.",
    stats: "30-Day Roadmap",
    highlight: "Results Focused",
    color: "from-yellow-500 to-orange-500"
  }
];

export function SlidingInfoSection() {
  return (
    <section className="w-full py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
            AI-Powered Insights
          </Badge>
          <h2 className="text-5xl md:text-6xl lg:text-7xl text-slate-900 mb-4">
          Insights That Make Every
            <br />
            Listing Sell Faster
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          See what works. Fix what doesn’t.
            <br />
           Sell Faster.
          </p>
        </div>

        {/* Scrollable Cards */}
        <div className="relative -mx-4 px-4 md:px-8">
          <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            <div className="flex gap-6 pb-4">
              {infoCards.map((card, index) => {
                const Icon = card.icon;
                
                return (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[85vw] md:w-[400px] min-h-[420px] bg-white rounded-2xl border border-gray-100 p-8 shadow-lg hover:shadow-xl transition-shadow snap-start"
                  >
                    {/* Icon and Stats */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
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
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        .snap-start {
          scroll-snap-align: start;
        }
      `}</style>
    </section>
  );
}