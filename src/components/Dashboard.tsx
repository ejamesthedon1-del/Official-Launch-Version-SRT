import { useState } from "react";
import { TrendingUp, Eye, DollarSign, MapPin, Bed, Bath, Square, Calendar, AlertTriangle } from "lucide-react";
import { RatingCard } from "./RatingCard";
import { LockedSection } from "./LockedSection";
import { SubscriptionDialog } from "./SubscriptionDialog";
import { Navigation } from "./Navigation";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
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
  analysisData: AnalysisData;
  onMenuClick?: () => void;
}

export function Dashboard({ onSubscribe, onNavigate, address, analysisData, onMenuClick }: DashboardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Use the dynamic analysis data
  const { listing, overallScore, ratings, categoryScores, radarData, insights } = analysisData;

  const handleSubscribe = () => {
    setDialogOpen(true);
  };

  const handleSubscriptionComplete = () => {
    setDialogOpen(false);
    onSubscribe();
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation currentView="dashboard" onNavigate={onNavigate} onMenuClick={onMenuClick} />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Property Overview */}
        <Card className="p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
                alt="Property"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            
            <div className="md:col-span-2 space-y-4">
              <div>
                <h2 className="mb-1">{listing.address}</h2>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.city}</span>
                </div>
                <p className="text-sm text-muted-foreground">{listing.propertyType}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex flex-col">
                  <div className="text-sm text-muted-foreground mb-1">Price</div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>{listing.price}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{listing.pricePerSqft}</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-sm text-muted-foreground mb-1">Beds</div>
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4 text-muted-foreground" />
                    <div>{listing.beds}</div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="text-sm text-muted-foreground mb-1">Baths</div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4 text-muted-foreground" />
                    <div>{listing.baths}</div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="text-sm text-muted-foreground mb-1">Sq Ft</div>
                  <div className="flex items-center gap-1">
                    <Square className="w-4 h-4 text-muted-foreground" />
                    <div>{listing.sqft}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
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

        {/* Overall AI Score */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-background">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              AI Analysis Complete
            </Badge>
            <h2 className="mb-2">Overall Listing Score</h2>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-6xl">{overallScore}</div>
              <div className="text-2xl text-muted-foreground">/100</div>
            </div>
            <Progress value={overallScore} className="h-3 mb-4" />
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {insights.summary}
            </p>
          </div>
        </Card>

        {/* Detailed Ratings */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="mb-2">Top 10 Factors Affecting Selling Time</h2>
            <p className="text-muted-foreground">
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
              <p className="text-muted-foreground">
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
            <p className="text-muted-foreground">
              Get your full AI-generated marketing strategy to maximize your listing's potential
            </p>
          </div>
          <LockedSection onSubscribe={handleSubscribe} />
        </div>
      </main>

      <SubscriptionDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubscribe={handleSubscriptionComplete} address={address} />
    </div>
  );
}
