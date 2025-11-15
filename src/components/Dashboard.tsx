import { useState, useEffect } from "react";
import { TrendingUp, Eye, DollarSign, MapPin, Bed, Bath, Square, Calendar, AlertTriangle, CheckCircle2, AlertCircle, ChevronRight, Sparkles, Ruler, Bell, Settings, TrendingDown, Zap } from "lucide-react";
import { RatingCard } from "./RatingCard";
import { LockedSection } from "./LockedSection";
import { SubscriptionDialog } from "./SubscriptionDialog";
import { Navigation } from "./Navigation";
import { LockedDashboard } from "./LockedDashboard";
import { Paywall } from "./Paywall";
import { Footer } from "./Footer";
import { supabase } from "../lib/supabaseClient";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { CircularProgress } from "./CircularProgress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface AnalysisData {
  listing: {
    address: string;
    city: string;
    propertyType: string;
    price: string;
    pricePerSqft: string;
    beds: number;
    baths: number;
    sqft: string;
    daysOnMarket: number;
    imageUrl?: string | null;
  };
  overallScore: number;
  ratings: Array<{
    title: string;
    score: number;
    maxScore: number;
    category: string;
    description: string;
  }>;
  categoryScores: Array<{
    category: string;
    score: number;
  }>;
  radarData: Array<{
    subject: string;
    A: number;
    fullMark: number;
  }>;
  insights: {
    summary: string;
    alerts: Array<{
      type: string;
      title: string;
      message: string;
    }>;
    topPriorities: string[];
    pricingInsight?: string | null;
    sellingSpeedPrediction?: string | null;
  };
}

interface DashboardProps {
  onSubscribe: () => void;
  onNavigate: (view: "home" | "address-input" | "dashboard" | "marketing-plan") => void;
  address: string;
  analysisData: AnalysisData | null;
  onMenuClick?: () => void;
}

export function Dashboard({ onSubscribe, onNavigate, address, analysisData, onMenuClick }: DashboardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [hasAnalyzedBefore, setHasAnalyzedBefore] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  // Check subscription status
  useEffect(() => {
    const checkSubscription = async () => {
      if (!address) {
        setCheckingSubscription(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke(
          "make-server-52cdd920/check-subscription",
          {
            body: { address },
          }
        );

        if (!error && data?.hasSubscription) {
          setIsSubscribed(true);
        }
      } catch (err) {
        console.error("Error checking subscription:", err);
      } finally {
        setCheckingSubscription(false);
      }
    };

    checkSubscription();
  }, [address]);

  // Check if user has analyzed before (in real app, this would come from backend)
  useEffect(() => {
    const hasAnalyzed = localStorage.getItem('hasAnalyzedBefore');
    setHasAnalyzedBefore(!!hasAnalyzed);
    
    // Show paywall after first analysis (only if not subscribed)
    if (analysisData && !hasAnalyzed && !isSubscribed) {
      setTimeout(() => {
        setShowPaywall(true);
        localStorage.setItem('hasAnalyzedBefore', 'true');
      }, 2000);
    }
  }, [analysisData, isSubscribed]);

  // Show empty state if no analysis data
  if (!analysisData) {
    return (
      <LockedDashboard 
        onAnalyze={() => onNavigate("address-input")}
      />
    );
  }

  // Use the dynamic analysis data
  const { listing, overallScore, ratings, categoryScores, radarData, insights } = analysisData;

  const handleSubscribe = () => {
    setShowPaywall(false);
    setDialogOpen(true);
  };

  const handleSubscriptionComplete = () => {
    setDialogOpen(false);
    setIsSubscribed(true);
    setShowPaywall(false);
    onSubscribe();
  };

  const handleNavigateToAnalysis = () => {
    onNavigate("address-input");
  };

  // Helper function to get score label
  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Improvement";
  };

  // Days on Market for alerts
  const daysOnMarket = listing.daysOnMarket || 0;

  // Parse address to separate street address from city/state
  const parseAddress = (fullAddress: string, city: string) => {
    // If address contains commas, split it
    const addressParts = fullAddress.split(",");
    if (addressParts.length > 1) {
      // Street address is everything before the first comma
      const streetAddress = addressParts[0].trim();
      // City/State is everything after the first comma
      const cityState = addressParts.slice(1).join(",").trim();
      return { streetAddress, cityState: cityState || city };
    }
    // If no commas, use the full address as street and city as city/state
    return { streetAddress: fullAddress, cityState: city };
  };

  const { streetAddress, cityState } = parseAddress(listing.address, listing.city);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 w-full min-h-screen">
      <Navigation currentView="dashboard" onNavigate={onNavigate} onMenuClick={onMenuClick} />

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full pt-12 md:pt-24">
          {/* Property Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden mb-6">
            {/* Property Image with Score Bar Space on Mobile */}
            {listing.imageUrl && (
              <div className="flex md:block">
                {/* Property Image - Takes most space, leaves room for score bar on mobile */}
                <div className="flex-1 h-[60vh] md:h-80 lg:h-96 relative overflow-hidden">
                  <img
                    src={listing.imageUrl}
                    alt={streetAddress}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Hide image if it fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                
                {/* Score Bar - Right side on mobile */}
                <div className="md:hidden flex items-center justify-center px-4 bg-slate-50 w-24">
                  <div className="text-center">
                    <CircularProgress 
                      percentage={overallScore} 
                      size={80} 
                      strokeWidth={8}
                      showAnimation={true}
                    />
                    <div className="mt-1">
                      <div className="text-xs text-slate-700 font-semibold">{overallScore}</div>
                      <div className="text-[10px] text-slate-500">{getScoreLabel(overallScore)}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid lg:grid-cols-2 gap-6 p-4 md:p-6">
              {/* Circular Progress Score - Desktop Only */}
              <div className="hidden md:flex items-center justify-center">
                <div className="text-center">
                  <CircularProgress 
                    percentage={overallScore} 
                    size={240} 
                    strokeWidth={24}
                    showAnimation={true}
                  />
                  <div className="mt-4">
                    <div className="text-sm text-slate-600 mb-1">AI Smart Listing Score</div>
                    <div className="text-xs text-slate-500">{getScoreLabel(overallScore)}</div>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="mb-3 mt-2">
                    <div>
                      <h2 className="text-slate-900 mb-1 text-xl md:text-2xl font-semibold">{streetAddress}</h2>
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span>{cityState}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 border border-slate-200">
                      <div className="text-xs text-slate-600 mb-1">List Price</div>
                      <div className="text-slate-900 text-lg">{listing.price}</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 border border-slate-200">
                      <div className="text-xs text-slate-600 mb-1">Days on Market</div>
                      <div className="text-slate-900 text-lg">{listing.daysOnMarket} days</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-white rounded-lg p-2.5 border border-slate-200 text-center hover:border-blue-300 transition-colors cursor-pointer">
                      <Bed className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                      <div className="text-xs text-slate-600">{listing.beds} Beds</div>
                    </div>
                    <div className="bg-white rounded-lg p-2.5 border border-slate-200 text-center hover:border-blue-300 transition-colors cursor-pointer">
                      <Bath className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                      <div className="text-xs text-slate-600">{listing.baths} Baths</div>
                    </div>
                    <div className="bg-white rounded-lg p-2.5 border border-slate-200 text-center hover:border-blue-300 transition-colors cursor-pointer">
                      <Ruler className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                      <div className="text-xs text-slate-600">{listing.sqft} sqft</div>
                    </div>
                  </div>
                  <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3">
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                      {insights.summary}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Days on Market Alert - Prominent if DOM > 30 */}
          {daysOnMarket > 30 && (
            <Card className={`p-4 md:p-6 mb-6 ${daysOnMarket > 60 ? 'bg-destructive/10 border-destructive/20' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex items-start gap-3 md:gap-4">
                <AlertTriangle className={`w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-0.5 ${daysOnMarket > 60 ? 'text-destructive' : 'text-amber-600'}`} />
                <div className="flex-1">
                  <div className={`font-semibold mb-2 ${daysOnMarket > 60 ? 'text-destructive' : 'text-amber-900'}`}>
                    {daysOnMarket > 60 ? 'URGENT: Listing is Stale' : 'Warning: Above Average Days on Market'}
                  </div>
                  <p className={`text-sm mb-4 ${daysOnMarket > 60 ? 'text-destructive/80' : 'text-amber-800'}`}>
                    {daysOnMarket > 60 
                      ? `This property has been on market ${daysOnMarket} days (60+ days). Immediate pricing or positioning action required to prevent further buyer disinterest.`
                      : `Property has been on market ${daysOnMarket} days (above 30-day threshold). Consider reviewing pricing strategy.`
                    }
                  </p>
                  {insights.pricingInsight && (
                    <div className="bg-white/60 rounded-lg p-3 border border-amber-200">
                      <div className="text-xs font-medium text-amber-900 mb-1">Recommended Action:</div>
                      <div className="text-sm text-amber-800">{insights.pricingInsight}</div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Other Alerts */}
          {insights.alerts.length > 0 && insights.alerts.filter(a => !a.title.includes('Days on Market')).map((alert, idx) => (
            <Card key={idx} className="p-4 mb-6 bg-destructive/10 border-destructive/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <div className="mb-1">{alert.title}</div>
                  <p className="text-sm text-muted-foreground">
                    {alert.message}
                  </p>
                </div>
              </div>
            </Card>
          ))}

          {/* Paywall Modal - Right after the property header/score section */}
          {!isSubscribed && showPaywall && (
            <div className="mb-8">
              <Paywall 
                onSubscribe={handleSubscribe}
                onClose={() => setShowPaywall(false)}
                analysisData={analysisData}
              />
            </div>
          )}

          {/* Analytics Grid */}
          {!isSubscribed ? (
            <div className="relative">
              {/* Blurred Content */}
              <div className="backdrop-blur-sm rounded-2xl overflow-hidden">
                <div className="grid lg:grid-cols-3 gap-6 mb-6 opacity-30">
                  {/* Market & Listing Performance */}
                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200/50 p-4 md:p-6">
                    <h3 className="text-slate-900 mb-1 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Market & Listing Performance
                    </h3>
                    <p className="text-sm text-slate-600 mb-5">Category performance breakdown</p>

                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryScores}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#64748b' }} angle={-45} textAnchor="end" height={80} />
                          <YAxis tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              padding: '8px 12px'
                            }}
                          />
                          <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-4 md:p-6">
                    <h3 className="text-slate-900 mb-1 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      AI Insights
                    </h3>
                    <p className="text-sm text-slate-600 mb-5">Smart recommendations</p>
                    <div className="space-y-3">
                      {insights.topPriorities.slice(0, 4).map((priority, index) => (
                        <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-start gap-2 mb-2">
                            <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-slate-900">{priority}</div>
                          </div>
                        </div>
                      ))}
                      {insights.pricingInsight && (
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/50 rounded-lg p-3 mt-3">
                          <div className="flex items-start gap-2">
                            <DollarSign className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-slate-900">{insights.pricingInsight}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing Strategy & Selling Speed */}
                <div className="grid lg:grid-cols-2 gap-6 mb-6 opacity-30">
                  {/* Pricing Strategy */}
                  {insights.pricingInsight && (
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-4 md:p-6">
                      <h3 className="text-slate-900 mb-1 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        Pricing Strategy
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">Actionable pricing guidance</p>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50 rounded-lg p-4">
                        <p className="text-sm text-slate-900 leading-relaxed">{insights.pricingInsight}</p>
                      </div>
                      <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                        Review Pricing Strategy
                      </Button>
                    </div>
                  )}

                  {/* Selling Speed Prediction */}
                  {insights.sellingSpeedPrediction && (
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-4 md:p-6">
                      <h3 className="text-slate-900 mb-1 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-600" />
                        Selling Speed Prediction
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">Time-to-sale estimate</p>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/50 rounded-lg p-4">
                        <p className="text-sm text-slate-900 leading-relaxed">{insights.sellingSpeedPrediction}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Lock Overlay */}
              <div className="absolute inset-0 bg-white/80 backdrop-blur-md rounded-2xl flex items-start justify-center pt-8">
                <Card className="p-8 text-center max-w-md mx-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    Unlock Detailed Insights
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Get access to detailed factor breakdowns, performance charts, buyer insights, and complete marketing strategies.
                  </p>
                  <Button
                    size="lg"
                    onClick={handleSubscribe}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full"
                  >
                    Upgrade to Premium <Eye className="w-4 h-4" />
                  </Button>
                </Card>
              </div>
            </div>
          ) : (
          /* Premium Content (if subscribed) */
          <>
              {/* Analytics Grid */}
              <div className="grid lg:grid-cols-3 gap-6 mb-6">
                {/* Market & Listing Performance */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200/50 p-4 md:p-6">
                  <h3 className="text-slate-900 mb-1 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Market & Listing Performance
                  </h3>
                  <p className="text-sm text-slate-600 mb-5">Category performance breakdown</p>

                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryScores}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#64748b' }} angle={-45} textAnchor="end" height={80} />
                        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '8px 12px'
                          }}
                        />
                        <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-4 md:p-6">
                  <h3 className="text-slate-900 mb-1 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    AI Insights
                  </h3>
                  <p className="text-sm text-slate-600 mb-5">Smart recommendations</p>
                  <div className="space-y-3">
                    {insights.topPriorities.slice(0, 4).map((priority, index) => (
                      <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-start gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-slate-900">{priority}</div>
                        </div>
                      </div>
                    ))}
                    {insights.pricingInsight && (
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/50 rounded-lg p-3 mt-3">
                        <div className="flex items-start gap-2">
                          <DollarSign className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-slate-900">{insights.pricingInsight}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing Strategy & Selling Speed */}
              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Pricing Strategy */}
                {insights.pricingInsight && (
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-4 md:p-6">
                    <h3 className="text-slate-900 mb-1 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      Pricing Strategy
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">Actionable pricing guidance</p>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50 rounded-lg p-4">
                      <p className="text-sm text-slate-900 leading-relaxed">{insights.pricingInsight}</p>
                    </div>
                    <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                      Review Pricing Strategy
                    </Button>
                  </div>
                )}

                {/* Selling Speed Prediction */}
                {insights.sellingSpeedPrediction && (
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-4 md:p-6">
                    <h3 className="text-slate-900 mb-1 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      Selling Speed Prediction
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">Time-to-sale estimate</p>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/50 rounded-lg p-4">
                      <p className="text-sm text-slate-900 leading-relaxed">{insights.sellingSpeedPrediction}</p>
                    </div>
                  </div>
                )}
              </div>

            {/* Detailed Ratings */}
            <div className="mb-8">
              <div className="mb-6">
                <h2 className="mb-2 text-slate-900">Top 10 Factors Affecting Selling Time</h2>
                <p className="text-slate-600">
                  Ranked by impact on your ability to sell within 30 days
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {ratings.map((rating, index) => (
                  <RatingCard key={index} {...rating} />
                ))}
              </div>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <h3 className="mb-6">Factor Performance Scores</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryScores}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="category" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="mb-6">Key Areas Assessment</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar
                      name="Your Listing"
                      dataKey="A"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Key Insights */}
            <Card className="p-6 mb-8">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2">Key Insights & Priorities</h3>
                  <p className="text-slate-600">
                    Based on our AI analysis of thousands of successful listings
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {insights.topPriorities.map((priority, index) => (
                  <div key={index} className="flex gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-primary-foreground">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm">{priority}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Locked Premium Section */}
            <div className="mb-8">
              <div className="mb-6">
                <h2 className="mb-2">Complete Marketing Plan</h2>
                <p className="text-slate-600">
                  Get your full AI-generated marketing strategy to maximize your listing's potential
                </p>
              </div>
              <LockedSection onSubscribe={handleSubscribe} />
            </div>
          </>
        )}
      </main>
      </div>


      <SubscriptionDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubscribe={handleSubscriptionComplete} address={address} />
      
      <Footer />
    </div>
  );
}