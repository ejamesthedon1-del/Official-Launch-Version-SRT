import { useState, useEffect } from "react";
import { TrendingUp, Eye, DollarSign, MapPin, Bed, Bath, Square, Calendar, AlertTriangle, CheckCircle2, AlertCircle, ChevronRight, ChevronDown, ChevronUp, Sparkles, Ruler, Bell, Settings, TrendingDown, Zap, Users, Target, Lock } from "lucide-react";
import { RatingCard } from "./RatingCard";
import { LockedSection } from "./LockedSection";
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
  onNavigate: (view: "home" | "address-input" | "dashboard" | "marketing-plan" | "subscription") => void;
  address: string;
  analysisData: AnalysisData | null;
  onMenuClick?: () => void;
}

export function Dashboard({ onSubscribe, onNavigate, address, analysisData, onMenuClick }: DashboardProps) {
  const [showPaywall, setShowPaywall] = useState(false);
  const [hasAnalyzedBefore, setHasAnalyzedBefore] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [riskFactorsExpanded, setRiskFactorsExpanded] = useState(false);
  const [buyerConcernsExpanded, setBuyerConcernsExpanded] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());
  const [missedValueExpanded, setMissedValueExpanded] = useState(false);
  const [negotiationRiskExpanded, setNegotiationRiskExpanded] = useState(false);
  const [buyerMatchScoreExpanded, setBuyerMatchScoreExpanded] = useState(false);
  const [upgradeImpactExpanded, setUpgradeImpactExpanded] = useState(false);

  // Debug: Log received data
  useEffect(() => {
    console.log("📊 Dashboard received analysisData:", analysisData);
    console.log("📊 Dashboard listing.imageUrl:", analysisData?.listing?.imageUrl);
    console.log("📊 Dashboard full listing object:", analysisData?.listing);
  }, [analysisData]);

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
    onNavigate("subscription");
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

  // Parse address to separate street address, city/state, zip code, and USA
  const parseAddress = (fullAddress: string, city: string) => {
    // If address contains commas, split it
    const addressParts = fullAddress.split(",").map(p => p.trim());
    if (addressParts.length > 1) {
      // Street address is everything before the first comma
      const streetAddress = addressParts[0];
      // Extract city, state, zip code, and USA
      let cityState = "";
      let zipCode = "";
      let hasUSA = false;
      
      // Check if last part contains zip code and/or USA
      const lastPart = addressParts[addressParts.length - 1];
      const zipMatch = lastPart.match(/(\d{5}(?:-\d{4})?)/);
      const usaMatch = lastPart.match(/\b(USA|United States)\b/i);
      
      if (zipMatch) {
        // Has zip code - extract just the zip
        zipCode = zipMatch[1];
        hasUSA = !!usaMatch;
        // City/State is everything between street and zip/USA
        cityState = addressParts.slice(1, -1).join(", ");
      } else if (usaMatch) {
        // Last part is just USA
        hasUSA = true;
        cityState = addressParts.slice(1, -1).join(", ");
      } else {
        // No zip/USA, just city/state
        cityState = addressParts.slice(1).join(", ");
      }
      
      return { 
        streetAddress, 
        cityState: cityState || city,
        zipCode: zipCode || "",
        hasUSA
      };
    }
    // If no commas, try to extract zip and USA from the address string
    const zipMatch = fullAddress.match(/\b(\d{5}(?:-\d{4})?)\b/);
    const zipCode = zipMatch ? zipMatch[1] : "";
    const hasUSA = /\b(USA|United States)\b/i.test(fullAddress);
    const streetAddress = zipCode ? fullAddress.replace(/\b\d{5}(?:-\d{4})?\b.*$/, "").trim() : fullAddress;
    
    return { streetAddress, cityState: city, zipCode, hasUSA };
  };

  const { streetAddress, cityState, zipCode, hasUSA } = parseAddress(listing.address, listing.city);

  return (
    <div className="bg-white w-full min-h-screen">
      <Navigation currentView="dashboard" onNavigate={onNavigate} onMenuClick={onMenuClick} />

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full pt-6 md:pt-24 lg:max-w-none lg:mx-0 lg:pt-0 lg:pb-0">
          {/* Dashboard Headline */}
          <div className="hidden lg:block mb-4 lg:px-6">
            <h1 className="text-slate-900 font-semibold text-xl md:text-2xl">
              Hi there.
              <br />
              Your insights are ready.
            </h1>
          </div>

          {/* Desktop Layout - Direct dashboard content (no mock browser) */}
          <div className="hidden lg:block mb-6">
            <div className="p-6 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 rounded-2xl">
                {/* Property Header - 3 Column Grid on Desktop */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
                  <div className="grid lg:grid-cols-3 gap-4 p-4">
                    {/* Column 1: Image (wider on desktop) */}
                    <div className="flex gap-4 items-start">
                      {listing.imageUrl ? (
                        <div className="flex-shrink-0 w-72 h-40">
                          <div className="relative w-full h-full rounded-lg overflow-hidden">
                            <img
                              src={listing.imageUrl}
                              alt={streetAddress}
                              className="w-full h-full object-cover"
                              onLoad={() => {
                                console.log("✅ Image loaded successfully:", listing.imageUrl);
                              }}
                              onError={(e) => {
                                console.error("❌ Image failed to load:", listing.imageUrl);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-72 h-40 bg-slate-100 rounded-lg flex items-center justify-center">
                          <p className="text-xs text-slate-500">No image available</p>
                        </div>
                      )}
                      {/* Mobile: Score visible here, hidden on desktop */}
                      <div className="flex flex-col flex-1 lg:hidden">
                        <div className="text-center">
                          <CircularProgress 
                            percentage={overallScore} 
                            size={80} 
                            strokeWidth={9}
                            showAnimation={true}
                          />
                          <div className="mt-2">
                            <div className="text-xs text-slate-600 mb-0.5">AI Smart Listing Score</div>
                            <div className="text-[10px] text-slate-500">{getScoreLabel(overallScore)}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Property Details */}
                    <div className="flex flex-col justify-between">
                      <div>
                        {/* Mobile: Address section */}
                        <div className="lg:hidden -mt-8 mb-1.5">
                          <h2 className="text-slate-900 text-lg font-semibold line-clamp-2 mb-0.5">{streetAddress}</h2>
                          <div className="flex items-center gap-1 text-slate-600">
                            <MapPin className="w-3 h-3" />
                            <span className="text-xs line-clamp-1">{cityState}</span>
                          </div>
                          {(zipCode || hasUSA) && (
                            <div className="text-slate-600 text-xs ml-4">
                              {zipCode ? zipCode : ''}{zipCode && hasUSA ? ' ' : ''}{hasUSA ? 'USA' : ''}
                            </div>
                          )}
                        </div>
                        {/* Desktop: Address only */}
                        <h2 className="hidden lg:block text-slate-900 mb-1 text-lg font-semibold line-clamp-2">{streetAddress}</h2>
                        <div className="hidden lg:flex items-center gap-1 text-slate-600 mb-3">
                          <MapPin className="w-3 h-3" />
                          <span className="text-xs line-clamp-1">{cityState}</span>
                        </div>
                        {(zipCode || hasUSA) && (
                          <div className="hidden lg:block text-slate-600 text-xs mb-3 ml-4">
                            {zipCode ? zipCode : ''}{zipCode && hasUSA ? ' ' : ''}{hasUSA ? 'USA' : ''}
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-2">
                            <div className="text-[10px] text-slate-600 mb-0.5">List Price</div>
                            <div className="text-slate-900 text-sm font-semibold">{listing.price}</div>
                          </div>
                          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-2">
                            <div className="text-[10px] text-slate-600 mb-0.5">Days on Market</div>
                            <div className="text-slate-900 text-sm font-semibold">{listing.daysOnMarket} days</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          <div className="bg-white rounded-lg p-1.5 text-center">
                            <Bed className="w-3 h-3 text-blue-600 mx-auto mb-0.5" />
                            <div className="text-[10px] text-slate-600">{listing.beds} Beds</div>
                          </div>
                          <div className="bg-white rounded-lg p-1.5 text-center">
                            <Bath className="w-3 h-3 text-blue-600 mx-auto mb-0.5" />
                            <div className="text-[10px] text-slate-600">{listing.baths} Baths</div>
                          </div>
                          <div className="bg-white rounded-lg p-1.5 text-center">
                            <Ruler className="w-3 h-3 text-blue-600 mx-auto mb-0.5" />
                            <div className="text-[10px] text-slate-600">{listing.sqft} sqft</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Column 3: Score Bar and Message (Desktop only) */}
                    <div className="hidden lg:flex flex-col items-center justify-center">
                      <div className="text-center">
                        <CircularProgress 
                          percentage={overallScore} 
                          size={80} 
                          strokeWidth={9}
                          showAnimation={true}
                        />
                        <div className="mt-2">
                          <div className="text-xs text-slate-600 mb-0.5">AI Smart Listing Score</div>
                          <div className="text-[10px] text-slate-500">{getScoreLabel(overallScore)}</div>
                        </div>
                      </div>
                      {/* Analysis message */}
                      <div className="mt-3">
                        <div className="bg-blue-50/50 rounded-lg p-1.5 max-w-[200px]">
                          <p className="text-[9px] text-slate-700 leading-tight line-clamp-3">
                            {insights.summary?.substring(0, 120)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics Grid - Desktop only */}
                <div className="hidden lg:grid lg:grid-cols-3 gap-4 mb-4">
                  {/* Performance Analytics */}
                  <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-4">
                    <h3 className="text-slate-900 mb-1 text-sm flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      Performance Analytics
                    </h3>
                    <p className="text-[10px] text-slate-600 mb-3">7-day engagement overview</p>
                    
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <div className="text-center p-2 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg">
                        <Eye className="w-3 h-3 text-blue-600 mx-auto mb-1" />
                        <div className="text-slate-900 text-xs font-semibold">0</div>
                        <div className="text-[9px] text-slate-600">Views</div>
                      </div>
                      <div className="text-center p-2 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg">
                        <Users className="w-3 h-3 text-blue-600 mx-auto mb-1" />
                        <div className="text-slate-900 text-xs font-semibold">0</div>
                        <div className="text-[9px] text-slate-600">Inquiries</div>
                      </div>
                      <div className="text-center p-2 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg">
                        <Target className="w-3 h-3 text-blue-600 mx-auto mb-1" />
                        <div className="text-slate-900 text-xs font-semibold">{overallScore}</div>
                        <div className="text-[9px] text-slate-600">Score</div>
                      </div>
                      <div className="text-center p-2 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg">
                        <Calendar className="w-3 h-3 text-blue-600 mx-auto mb-1" />
                        <div className="text-slate-900 text-xs font-semibold">{listing.daysOnMarket}</div>
                        <div className="text-[9px] text-slate-600">Days</div>
                      </div>
                    </div>

                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryScores}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis 
                            dataKey="category" 
                            tick={{ fontSize: 8, fill: '#64748b' }} 
                            angle={-45} 
                            textAnchor="end" 
                            height={40}
                          />
                          <YAxis tick={{ fontSize: 8, fill: '#64748b' }} domain={[0, 100]} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '10px'
                            }}
                          />
                          <Bar dataKey="score" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="bg-white rounded-xl shadow-lg p-4">
                    <h3 className="text-slate-900 mb-1 text-sm flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      AI Insights
                    </h3>
                    <p className="text-[10px] text-slate-600 mb-3">Smart recommendations</p>
                    <div className="space-y-2">
                      {insights.topPriorities?.slice(0, 2).map((priority, index) => (
                        <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-2">
                          <div className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-[10px] text-slate-900 leading-tight line-clamp-2">{priority}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
            </div>
          </div>

          {/* Mobile Layout - Keep existing structure */}
          <div className="lg:hidden">
            {/* Property Header */}
            <div className="mb-6">
              {/* Property Image */}
              {listing.imageUrl && (
                <div className="w-screen -mx-4 md:-mx-8 h-64 md:h-80 relative overflow-hidden">
                  <img
                    src={listing.imageUrl}
                    alt={streetAddress}
                    className="w-full h-full object-cover"
                    onLoad={() => {
                      console.log("✅ Image loaded successfully:", listing.imageUrl);
                    }}
                    onError={(e) => {
                      console.error("❌ Image failed to load:", listing.imageUrl);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              {!listing.imageUrl && (
                <div className="p-4">
                  <p className="text-sm text-slate-500">No image available for this listing</p>
                </div>
              )}
              
              <div className="grid gap-6 p-4 md:p-6 pt-4">
                {/* Address and Score Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-slate-900 mb-1 text-[30px] md:text-2xl font-semibold">{streetAddress}</h2>
                    <div className="flex items-center gap-2 text-slate-600 mb-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-[15px] md:text-base">
                        {cityState}{zipCode ? `, ${zipCode}` : ''}{hasUSA ? (zipCode ? ', USA' : ' USA') : ''}
                      </span>
                    </div>
                    {/* List Price and Days on Market - Moved under address */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <div>
                        <div className="text-xs text-slate-600 mb-1">List Price</div>
                        <div className="text-slate-900 text-lg">{listing.price}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-600 mb-1">Days on Market</div>
                        <div className="text-slate-900 text-lg">{listing.daysOnMarket} days</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end mt-4">
                    <div className="relative" style={{ width: '120px', height: '120px' }}>
                      <div style={{ marginTop: '-0.2in' }}>
                        <CircularProgress 
                          percentage={overallScore} 
                          size={120} 
                          strokeWidth={9}
                          showAnimation={true}
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center pointer-events-none" style={{ bottom: '-8px' }}>
                        <div className="text-[9px] text-slate-600 mb-0.5 px-2 text-center leading-tight whitespace-nowrap">AI Smart Listing Score</div>
                        <div className="text-[8px] text-slate-500 text-center">{getScoreLabel(overallScore)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="p-2.5 text-center">
                        <Bed className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                        <div className="text-xs text-slate-600">{listing.beds} Beds</div>
                      </div>
                      <div className="p-2.5 text-center">
                        <Bath className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                        <div className="text-xs text-slate-600">{listing.baths} Baths</div>
                      </div>
                      <div className="p-2.5 text-center">
                        <Ruler className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                        <div className="text-xs text-slate-600">{listing.sqft} sqft</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-slate-900 font-semibold text-lg mb-3">Analysis summary</h3>
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                        {insights.summary}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Score Factors - Slider Bar Stats Section */}
          {ratings && ratings.length > 0 && (
            <div className="p-4 md:p-6 mb-6 lg:bg-white lg:border lg:border-slate-200/50 lg:rounded-lg lg:shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <h3 className="text-slate-900 font-semibold text-lg">Score factors</h3>
              </div>
              <div className="space-y-4">
                {ratings.map((rating, idx) => {
                  const percentage = (rating.score / rating.maxScore) * 100;
                  const isExpanded = expandedDescriptions.has(idx);
                  
                  // Check if description is long enough to need truncation (approximately 2 lines)
                  const description = rating.description || '';
                  const shouldTruncate = !isExpanded && description.length > 120; // Approximate 2 lines of text
                  
                  const getScoreColor = (score: number, maxScore: number) => {
                    // Always blue to match theme
                    return 'bg-blue-600';
                  };

                  const toggleDescription = () => {
                    const newExpanded = new Set(expandedDescriptions);
                    if (isExpanded) {
                      newExpanded.delete(idx);
                    } else {
                      newExpanded.add(idx);
                    }
                    setExpandedDescriptions(newExpanded);
                  };
                  
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-900 mb-0.5">
                            {rating.title}
                          </div>
                          <div className="text-[13.5px] text-slate-600">
                            {!isExpanded && shouldTruncate ? (
                              <div className="relative">
                                <div className="line-clamp-2 pr-20">
                                  {description}
                                </div>
                                <span className="absolute bottom-0 right-0">
                                  {!isSubscribed ? (
                                    <button
                                      onClick={handleSubscribe}
                                      className="text-blue-600 hover:text-blue-700 transition-colors underline"
                                    >
                                      read more
                                    </button>
                                  ) : (
                                    <button
                                      onClick={toggleDescription}
                                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                    >
                                      read more
                                    </button>
                                  )}
                                </span>
                              </div>
                            ) : (
                              <>
                                {description}
                                {isExpanded && (
                                  <button
                                    onClick={toggleDescription}
                                    className="ml-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                  >
                                    Read less
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="ml-4 text-right flex-shrink-0">
                          <div className="text-sm font-bold text-slate-900">
                            {rating.score}/{rating.maxScore}
                          </div>
                          <div className="text-xs text-slate-500">
                            {Math.round(percentage)}%
                          </div>
                        </div>
                      </div>
                      <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ease-out ${getScoreColor(rating.score, rating.maxScore)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Premium Insights Menu - All Collapsibles Combined */}
          <div className="p-4 md:p-6 mb-6 lg:bg-white lg:border lg:border-slate-200/50 lg:rounded-lg lg:shadow-sm">
            <div className="mb-4">
              <h3 className="text-slate-900 font-semibold text-lg mb-1">Premium insights</h3>
              <p className="text-sm text-slate-600 text-left">Unlock your premium insights and marketing plan to help you understand and improve your listing</p>
            </div>
            <div className="space-y-2">
              {/* Buyer Concerns Section */}
              {(insights.topPriorities && insights.topPriorities.length > 0) && (
                <div className="lg:border lg:border-slate-200 lg:rounded-lg lg:overflow-hidden">
                  <button
                    onClick={() => !isSubscribed ? handleSubscribe() : setBuyerConcernsExpanded(!buyerConcernsExpanded)}
                    className="w-full flex items-center justify-between gap-2 p-3 lg:hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex flex-col items-start flex-1 min-w-0">
                        <h4 className="text-slate-900 font-medium text-lg">Buyer concerns</h4>
                        <p className="text-sm text-slate-600 mt-0.5 text-left break-words" style={{ maxWidth: 'calc(100% - 1rem)' }}>Reveals what might worry potential buyers<br />so you can fix issues before they kill interest.</p>
                      </div>
                    </div>
                    {!isSubscribed ? (
                      <Lock className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    ) : buyerConcernsExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    )}
                  </button>
                  {buyerConcernsExpanded && (
                    <div className="px-3 pb-3">
                      {!isSubscribed ? (
                        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-center">
                          <p className="text-sm text-slate-700 mb-3">
                            Upgrade to get your buyer concerns insights
                          </p>
                          <button
                            onClick={handleSubscribe}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            Upgrade now
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {insights.topPriorities.map((concern, idx) => (
                            <div key={idx} className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                              <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                                <p className="text-xs text-slate-700 leading-relaxed">
                                  {concern}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Risk Factors Section */}
              {(daysOnMarket > 30 || insights.alerts.length > 0) && (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => !isSubscribed ? handleSubscribe() : setRiskFactorsExpanded(!riskFactorsExpanded)}
                    className="w-full flex items-center justify-between gap-2 p-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex flex-col items-start flex-1 min-w-0">
                        <h4 className="text-slate-900 font-medium text-lg">Risk factors</h4>
                        <p className="text-sm text-slate-600 mt-0.5 text-left break-words" style={{ maxWidth: 'calc(100% - 1rem)' }}>Shows hidden red flags that could reduce<br />offers or slow down your sale.</p>
                      </div>
                    </div>
                    {!isSubscribed ? (
                      <Lock className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    ) : riskFactorsExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    )}
                  </button>
                  {riskFactorsExpanded && (
                    <div className="px-3 pb-3">
                      {!isSubscribed ? (
                        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-center">
                          <p className="text-sm text-slate-700 mb-3">
                            Upgrade to get your risk factors insights
                          </p>
                          <button
                            onClick={handleSubscribe}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            Upgrade now
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
          {daysOnMarket > 30 && (
                            <div className={`p-3 rounded-lg ${daysOnMarket > 60 ? 'bg-destructive/10 border border-destructive/20' : 'bg-amber-50 border border-amber-200'}`}>
                              <div className="flex items-start gap-2">
                <div className="flex-1">
                                  <div className={`text-xs font-semibold mb-1 ${daysOnMarket > 60 ? 'text-destructive' : 'text-amber-900'}`}>
                                    {daysOnMarket > 60 ? 'Urgent: listing is stale' : 'Warning: above average days on market'}
                  </div>
                                  <p className={`text-xs mb-2 ${daysOnMarket > 60 ? 'text-destructive/80' : 'text-amber-800'}`}>
                    {daysOnMarket > 60 
                                      ? `This property has been on market ${daysOnMarket} days (60+ days). Immediate pricing or positioning action required.`
                      : `Property has been on market ${daysOnMarket} days (above 30-day threshold). Consider reviewing pricing strategy.`
                    }
                  </p>
                  {insights.pricingInsight && (
                                    <div className="bg-white/60 rounded p-2 border border-amber-200">
                                      <div className="text-[10px] font-medium text-amber-900 mb-0.5">Recommended action:</div>
                                      <div className="text-xs text-amber-800">{insights.pricingInsight}</div>
                    </div>
                  )}
                </div>
              </div>
                            </div>
          )}
                          {insights.alerts.filter(a => !a.title.includes('Days on Market')).map((alert, idx) => (
                            <div key={idx} className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                              <div className="flex items-start gap-2">
                                <div className="flex-1">
                                  <div className="text-xs font-semibold mb-0.5 text-destructive">{alert.title}</div>
                                  <p className="text-xs text-destructive/80">
                    {alert.message}
                  </p>
                </div>
              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Missed Value Points Section */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => !isSubscribed ? handleSubscribe() : setMissedValueExpanded(!missedValueExpanded)}
                  className="w-full flex items-center justify-between gap-2 p-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <h4 className="text-slate-900 font-medium text-lg">Missed value points</h4>
                      <p className="text-sm text-slate-600 mt-0.5 text-left break-words" style={{ maxWidth: 'calc(100% - 1rem)' }}>Highlights things you're not showcasing that<br />could increase your perceived property value.</p>
                    </div>
                  </div>
                  {!isSubscribed ? (
                    <Lock className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  ) : missedValueExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  )}
                </button>
                {missedValueExpanded && (
                  <div className="px-3 pb-3">
                    {!isSubscribed ? (
                      <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 text-center">
                        <p className="text-sm text-slate-700 mb-3">
                          Upgrade to get your missed value points insights
                        </p>
                        <button
                          onClick={handleSubscribe}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Upgrade Now
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-purple-900 mb-0.5">Pricing optimization</div>
                              <p className="text-xs text-purple-800 leading-relaxed">
                                Current pricing may be leaving potential value on the table. Market analysis suggests opportunities for strategic price positioning.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-purple-900 mb-0.5">Marketing visibility</div>
                              <p className="text-xs text-purple-800 leading-relaxed">
                                Enhanced marketing strategies could increase property visibility and attract more qualified buyers.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-purple-900 mb-0.5">Property presentation</div>
                              <p className="text-xs text-purple-800 leading-relaxed">
                                Strategic improvements to property presentation could significantly enhance perceived value.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Negotiation Risk Section */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => !isSubscribed ? handleSubscribe() : setNegotiationRiskExpanded(!negotiationRiskExpanded)}
                  className="w-full flex items-center justify-between gap-2 p-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <h4 className="text-slate-900 font-medium text-lg">Negotiation risk</h4>
                      <p className="text-sm text-slate-600 mt-0.5 text-left break-words" style={{ maxWidth: 'calc(100% - 1rem)' }}>Identifies weaknesses buyers may use<br />to negotiate your price down.</p>
                    </div>
                  </div>
                  {!isSubscribed ? (
                    <Lock className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  ) : negotiationRiskExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  )}
                </button>
                {negotiationRiskExpanded && (
                  <div className="px-3 pb-3">
                    {!isSubscribed ? (
                      <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 text-center">
                        <p className="text-sm text-slate-700 mb-3">
                          Upgrade to get your negotiation risk insights
                        </p>
                        <button
                          onClick={handleSubscribe}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Upgrade Now
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-orange-900 mb-0.5">Price negotiation risk</div>
                              <p className="text-xs text-orange-800 leading-relaxed">
                                {daysOnMarket > 30 
                                  ? `With ${daysOnMarket} days on market, buyers may perceive opportunity for significant price negotiation.`
                                  : 'Current market positioning suggests moderate negotiation risk.'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-orange-900 mb-0.5">Timing risk</div>
                              <p className="text-xs text-orange-800 leading-relaxed">
                                Extended time on market may increase buyer expectations for concessions.
                              </p>
                            </div>
                          </div>
                        </div>
                        {insights.pricingInsight && (
                          <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                            <div className="flex items-start gap-2">
                              <div className="flex-1">
                                <div className="text-xs font-semibold text-orange-900 mb-0.5">Recommended strategy</div>
                                <p className="text-xs text-orange-800 leading-relaxed">
                                  {insights.pricingInsight}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Buyer Match Score Section */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => !isSubscribed ? handleSubscribe() : setBuyerMatchScoreExpanded(!buyerMatchScoreExpanded)}
                  className="w-full flex items-center justify-between gap-2 p-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <h4 className="text-slate-900 font-medium text-lg">Buyer match score</h4>
                      <p className="text-sm text-slate-600 mt-0.5 text-left break-words" style={{ maxWidth: 'calc(100% - 1rem)' }}>Measures how well your listing aligns with<br />current buyer preferences in your market.</p>
                    </div>
                  </div>
                  {!isSubscribed ? (
                    <Lock className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  ) : buyerMatchScoreExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  )}
                </button>
                {buyerMatchScoreExpanded && (
                  <div className="px-3 pb-3">
                    {!isSubscribed ? (
                      <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 text-center">
                        <p className="text-sm text-slate-700 mb-3">
                          Upgrade to get your buyer match score insights
                        </p>
                        <button
                          onClick={handleSubscribe}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Upgrade Now
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs font-semibold text-indigo-900">Overall buyer match</div>
                            <div className="text-sm font-bold text-indigo-600">{overallScore}%</div>
                          </div>
                          <div className="relative h-2 bg-indigo-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${overallScore}%` }}
                            />
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200">
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-indigo-900 mb-0.5">Target buyer alignment</div>
                              <p className="text-xs text-indigo-800 leading-relaxed">
                                Property characteristics align with {overallScore >= 70 ? 'strong' : overallScore >= 50 ? 'moderate' : 'limited'} buyer interest.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200">
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-indigo-900 mb-0.5">Market appeal</div>
                              <p className="text-xs text-indigo-800 leading-relaxed">
                                {overallScore >= 70 
                                  ? 'Property demonstrates strong market appeal.'
                                  : 'Opportunities exist to enhance market appeal.'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Upgrade Impact Section */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => !isSubscribed ? handleSubscribe() : setUpgradeImpactExpanded(!upgradeImpactExpanded)}
                  className="w-full flex items-center justify-between gap-2 p-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <h4 className="text-slate-900 font-medium text-lg">Upgrade impact</h4>
                      <p className="text-sm text-slate-600 mt-0.5 text-left break-words" style={{ maxWidth: 'calc(100% - 1rem)' }}>Predicts how much improving your listing<br />could boost views, tours, and offers.</p>
                    </div>
                  </div>
                  {!isSubscribed ? (
                    <Lock className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  ) : upgradeImpactExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  )}
                </button>
                {upgradeImpactExpanded && (
                  <div className="px-3 pb-3">
                    {!isSubscribed ? (
                      <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                        <p className="text-sm text-slate-700 mb-3">
                          Upgrade to get your upgrade impact insights
                        </p>
                        <button
                          onClick={handleSubscribe}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Upgrade Now
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-emerald-900 mb-0.5">Score improvement potential</div>
                              <p className="text-xs text-emerald-800 leading-relaxed">
                                Strategic upgrades could increase your listing score by 15-25 points.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-emerald-900 mb-0.5">Value enhancement</div>
                              <p className="text-xs text-emerald-800 leading-relaxed">
                                Implementing improvements could enhance perceived property value.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-emerald-900 mb-0.5">Time to sale impact</div>
                              <p className="text-xs text-emerald-800 leading-relaxed">
                                {insights.sellingSpeedPrediction || 'Could reduce time on market by 30-40%.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Paywall Modal - Removed to view dashboard content */}

          {/* Analytics Grid */}
          {!isSubscribed ? (
            <div className="relative">
              {/* Content - Blur removed to view dashboard */}
              <div className="rounded-2xl overflow-hidden">
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
                        Selling speed prediction
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">Time-to-sale estimate</p>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/50 rounded-lg p-4">
                        <p className="text-sm text-slate-900 leading-relaxed">{insights.sellingSpeedPrediction}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Lock Overlay - Removed to view dashboard content */}
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
                <h2 className="mb-2">Complete marketing plan</h2>
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

      
      <Footer />
    </div>
  );
}