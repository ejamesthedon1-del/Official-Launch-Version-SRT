import { useState, useEffect } from "react";
import { TrendingUp, Eye, DollarSign, MapPin, Bed, Bath, Square, Calendar, AlertTriangle } from "lucide-react";
import { RatingCard } from "./RatingCard";
import { LockedSection } from "./LockedSection";
import { SubscriptionDialog } from "./SubscriptionDialog";
import { Navigation } from "./Navigation";
import { LockedDashboard } from "./LockedDashboard";
import { Paywall } from "./Paywall";
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

  return (
    <div className="min-h-screen bg-white">
      <Navigation currentView="dashboard" onNavigate={onNavigate} onMenuClick={onMenuClick} />

      <main className="container mx-auto px-4 pt-24 pb-12">
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

        {/* Top Row: Overall Score and Property Overview */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Overall AI Score - Always visible */}
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-background">
            <Badge className="mb-4" variant="secondary">
              AI Analysis Complete
            </Badge>
            <h2 className="mb-2">Overall Listing Score</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl">{overallScore}</div>
              <div className="text-xl text-muted-foreground">/100</div>
            </div>
            <Progress value={overallScore} className="h-3 mb-4" />
            <p className="text-muted-foreground">
              {insights.summary}
            </p>
          </Card>

          {/* Property Overview - Always visible */}
          <Card className="p-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-1">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
                  alt="Property"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
              
              <div className="col-span-2 space-y-3">
                <div>
                  <h3 className="mb-1">{listing.address}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{listing.city}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{listing.propertyType}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <div className="text-xs text-muted-foreground mb-1">Price</div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-muted-foreground" />
                      <div className="text-sm">{listing.price}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{listing.pricePerSqft}</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-xs text-muted-foreground mb-1">Beds</div>
                    <div className="flex items-center gap-1">
                      <Bed className="w-3 h-3 text-muted-foreground" />
                      <div className="text-sm">{listing.beds}</div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-xs text-muted-foreground mb-1">Baths</div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-3 h-3 text-muted-foreground" />
                      <div className="text-sm">{listing.baths}</div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-xs text-muted-foreground mb-1">Sq Ft</div>
                    <div className="flex items-center gap-1">
                      <Square className="w-3 h-3 text-muted-foreground" />
                      <div className="text-sm">{listing.sqft}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {listing.daysOnMarket} days on market
                    </span>
                  </div>
                  {listing.daysOnMarket > 45 && (
                    <Badge variant="destructive" className="text-xs">
                      Extended Market Time
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Paywalled Content */}
        {!isSubscribed ? (
          <div className="relative">
            {/* Blurred Content */}
            <div className="backdrop-blur-sm rounded-2xl overflow-hidden">
              {/* Detailed Ratings */}
              <div className="mb-8 opacity-30">
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
              <div className="grid md:grid-cols-2 gap-6 mb-8 opacity-30">
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
              <Card className="p-6 mb-8 opacity-30">
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
              <div className="mb-8 opacity-30">
                <div className="mb-6">
                  <h2 className="mb-2">Complete Marketing Plan</h2>
                  <p className="text-slate-600">
                    Get your full AI-generated marketing strategy to maximize your listing's potential
                  </p>
                </div>
                <LockedSection onSubscribe={handleSubscribe} />
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

      {/* Paywall Modal */}
      {showPaywall && (
        <Paywall 
          onSubscribe={handleSubscribe} 
          analysisData={analysisData}
        />
      )}

      <SubscriptionDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubscribe={handleSubscriptionComplete} address={address} />
    </div>
  );
}