import { useState, useEffect } from "react";
import { TrendingUp, Eye, DollarSign, MapPin, Bed, Bath, Square, Calendar, AlertTriangle, Heart, Share2, Camera, Users, CheckCircle2, AlertCircle, ChevronRight, Sparkles, Clock, Ruler, Bell, Settings, LogOut, Menu, X, Home } from "lucide-react";
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
import { ImageWithFallback } from "./figma/ImageWithFallback";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Map ratings to photo scores format
  const photoScores = ratings.slice(0, 5).map((rating) => ({
    name: rating.title,
    score: Math.round((rating.score / rating.maxScore) * 100),
  }));

  // Map topPriorities to timeline format
  const timelineItems = insights.topPriorities.slice(0, 4).map((priority, index) => ({
    title: priority,
    date: index === 0 ? "Today" : index === 1 ? "2 days ago" : index === 2 ? "5 days ago" : "7 days ago",
    icon: index === 0 ? CheckCircle2 : index === 1 ? Sparkles : index === 2 ? TrendingUp : Calendar,
  }));

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 w-full min-h-screen">
      <Navigation currentView="dashboard" onNavigate={onNavigate} onMenuClick={onMenuClick} />

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-slate-200 
          w-64 transform transition-transform duration-300 z-40 lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 pt-20 lg:pt-6">
            <div className="space-y-2">
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700">
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </a>
              <button onClick={() => onNavigate("address-input")} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors w-full text-left">
                <TrendingUp className="w-5 h-5" />
                <span>Analytics</span>
              </button>
              <button onClick={() => onNavigate("address-input")} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors w-full text-left">
                <Users className="w-5 h-5" />
                <span>Listings</span>
              </button>
              <button onClick={() => onNavigate("marketing-plan")} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors w-full text-left">
                <Calendar className="w-5 h-5" />
                <span>Schedule</span>
              </button>
              <button onClick={() => onNavigate("address-input")} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors w-full text-left">
                <Sparkles className="w-5 h-5" />
                <span>AI Tools</span>
              </button>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-200">
              <button onClick={() => onNavigate("home")} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors w-full text-left">
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
        {/* Alert Banner */}
        {insights.alerts.length > 0 && (
          <Card className="p-4 mb-6 bg-destructive/10 border-destructive/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <div className="mb-1">{insights.alerts[0].title}</div>
                <p className="text-sm text-muted-foreground">
                  {insights.alerts[0].message}
                </p>
              </div>
            </div>
          </Card>
        )}

          {/* Property Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden mb-6">
            <div className="grid lg:grid-cols-2 gap-6 p-4 md:p-6">
              {/* Property Image */}
              <div className="relative">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 shadow-md">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
                    alt={listing.address}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                  />
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    Active Listing
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse" />
                      <span className="text-xs text-slate-700">Live</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-slate-900 mb-1">{listing.address}</h2>
                      <div className="flex items-center gap-2 text-slate-600 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{listing.city}</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl px-4 py-3 text-center shadow-lg">
                      <div className="text-xs opacity-90 mb-0.5">AI Score</div>
                      <div className="text-3xl">{overallScore}</div>
                      <div className="text-xs opacity-75">{getScoreLabel(overallScore)}</div>
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
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {insights.summary}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Paywall Modal - Right after the property header/score section */}
          {!isSubscribed && showPaywall && (
            <div className="mb-8">
              <Paywall 
                onSubscribe={handleSubscribe} 
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
                  {/* Key Metrics */}
                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200/50 p-4 md:p-6">
                    <h3 className="text-slate-900 mb-1 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Performance Analytics
                    </h3>
                    <p className="text-sm text-slate-600 mb-5">7-day engagement overview</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200/50 hover:shadow-md transition-shadow cursor-pointer">
                        <Eye className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                        <div className="text-slate-900" style={{ fontSize: '1.25rem' }}>0</div>
                        <div className="text-xs text-slate-600">Total Views</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200/50 hover:shadow-md transition-shadow cursor-pointer">
                        <Heart className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                        <div className="text-slate-900" style={{ fontSize: '1.25rem' }}>0</div>
                        <div className="text-xs text-slate-600">Favorites</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200/50 hover:shadow-md transition-shadow cursor-pointer">
                        <Share2 className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                        <div className="text-slate-900" style={{ fontSize: '1.25rem' }}>0</div>
                        <div className="text-xs text-slate-600">Shares</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200/50 hover:shadow-md transition-shadow cursor-pointer">
                        <Users className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                        <div className="text-slate-900" style={{ fontSize: '1.25rem' }}>0</div>
                        <div className="text-xs text-slate-600">Inquiries</div>
                      </div>
                    </div>

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
                    </div>
                  </div>
                </div>

                {/* Bottom Grid */}
                <div className="grid lg:grid-cols-2 gap-6 mb-6 opacity-30">
                  {/* Photo Analysis */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-4 md:p-6">
                    <h3 className="text-slate-900 mb-1 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-blue-600" />
                      Photo Quality Analysis
                    </h3>
                    <p className="text-sm text-slate-600 mb-5">AI-scored room photography</p>
                    <div className="space-y-3">
                      {photoScores.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-lg transition-colors cursor-pointer">
                          <div className="text-sm text-slate-700 w-24 flex-shrink-0">{item.name}</div>
                          <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all"
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                          <div className="text-sm text-slate-900 w-8">{item.score}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Marketing Timeline */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-4 md:p-6">
                    <h3 className="text-slate-900 mb-1 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Marketing Timeline
                    </h3>
                    <p className="text-sm text-slate-600 mb-5">Recent activity and updates</p>
                    <div className="space-y-3">
                      {timelineItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <div key={index} className="flex gap-3 group cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="text-sm text-slate-900">{item.title}</div>
                                <div className="text-xs text-slate-500">{item.date}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lock Overlay */}
              <div className="absolute inset-0 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center">
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
                {/* Key Metrics */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200/50 p-4 md:p-6">
                  <h3 className="text-slate-900 mb-1 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Performance Analytics
                  </h3>
                  <p className="text-sm text-slate-600 mb-5">7-day engagement overview</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200/50 hover:shadow-md transition-shadow cursor-pointer">
                      <Eye className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                      <div className="text-slate-900" style={{ fontSize: '1.25rem' }}>0</div>
                      <div className="text-xs text-slate-600">Total Views</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200/50 hover:shadow-md transition-shadow cursor-pointer">
                      <Heart className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                      <div className="text-slate-900" style={{ fontSize: '1.25rem' }}>0</div>
                      <div className="text-xs text-slate-600">Favorites</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200/50 hover:shadow-md transition-shadow cursor-pointer">
                      <Share2 className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                      <div className="text-slate-900" style={{ fontSize: '1.25rem' }}>0</div>
                      <div className="text-xs text-slate-600">Shares</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200/50 hover:shadow-md transition-shadow cursor-pointer">
                      <Users className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                      <div className="text-slate-900" style={{ fontSize: '1.25rem' }}>0</div>
                      <div className="text-xs text-slate-600">Inquiries</div>
                    </div>
                  </div>

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
                  </div>
                </div>
              </div>

              {/* Bottom Grid */}
              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                {/* Photo Analysis */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-4 md:p-6">
                  <h3 className="text-slate-900 mb-1 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-blue-600" />
                    Photo Quality Analysis
                  </h3>
                  <p className="text-sm text-slate-600 mb-5">AI-scored room photography</p>
                  <div className="space-y-3">
                    {photoScores.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-lg transition-colors cursor-pointer">
                        <div className="text-sm text-slate-700 w-24 flex-shrink-0">{item.name}</div>
                        <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                        <div className="text-sm text-slate-900 w-8">{item.score}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-5 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-600 mb-1">Overall Score</div>
                        <div className="text-slate-900" style={{ fontSize: '1.5rem' }}>{Math.round(photoScores.reduce((acc, item) => acc + item.score, 0) / photoScores.length)}/100</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Marketing Timeline */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-4 md:p-6">
                  <h3 className="text-slate-900 mb-1 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Marketing Timeline
                  </h3>
                  <p className="text-sm text-slate-600 mb-5">Recent activity and updates</p>
                  <div className="space-y-3">
                    {timelineItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={index} className="flex gap-3 group cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-sm text-slate-900">{item.title}</div>
                              <div className="text-xs text-slate-500">{item.date}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
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

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <SubscriptionDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubscribe={handleSubscriptionComplete} address={address} />
      
      <Footer />
    </div>
  );
}