import { TrendingUp, Eye, DollarSign, MapPin, Bed, Bath, Square, Calendar, AlertTriangle } from "lucide-react";
import { RatingCard } from "./RatingCard";
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
} from "recharts";

// Compact dashboard preview for marketing purposes
export function DashboardPreview() {
  const listing = {
    address: "3404 American Dr APT 1105",
    city: "Lago Vista, TX 78645",
    price: "$395,000",
    beds: 2,
    baths: 2,
    sqft: "1,204",
    daysOnMarket: 61,
    image: "https://images.unsplash.com/photo-1759084689030-3f0caf69817f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtlJTIwdHJhdmlzJTIwdGV4YXMlMjB3YXRlcmZyb250fGVufDF8fHx8MTc2MjIxMjQzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  };

  const overallScore = 72;
  
  const topRatings = [
    {
      title: "Price Positioning",
      score: 65,
      maxScore: 100,
      category: "Impact Score: 95/100",
      description: "$395,000 appears 5-8% above market optimal. 61 days on market indicates pricing resistance.",
    },
    {
      title: "Marketing Visibility",
      score: 70,
      maxScore: 100,
      category: "Impact Score: 90/100",
      description: "Missing targeted digital marketing and luxury positioning.",
    },
  ];

  const categoryScores = [
    { category: "Condition", score: 85 },
    { category: "Location", score: 85 },
    { category: "Amenities", score: 80 },
    { category: "Investment", score: 75 },
    { category: "Price", score: 65 },
  ];

  return (
    <div className="bg-background">
      {/* Compact Header */}
      <div className="border-b bg-card p-3">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <h3 className="text-sm">Listing Analytics</h3>
          </div>
          <Badge variant="outline" className="gap-1 text-xs">
            <TrendingUp className="w-3 h-3" />
            AI Powered
          </Badge>
        </div>
      </div>

      <div className="p-4 max-w-5xl mx-auto space-y-4">
        {/* Property Overview - Compact */}
        <Card className="p-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <ImageWithFallback
                src={listing.image}
                alt="Property"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
            
            <div className="md:col-span-2 space-y-3">
              <div>
                <h3 className="text-sm mb-0.5">{listing.address}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{listing.city}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>
                  <div className="text-muted-foreground mb-0.5">Price</div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    <span className="text-xs">{listing.price}</span>
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-0.5">Beds</div>
                  <div className="flex items-center gap-1">
                    <Bed className="w-3 h-3" />
                    <span>{listing.beds}</span>
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-0.5">Baths</div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-3 h-3" />
                    <span>{listing.baths}</span>
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-0.5">Sq Ft</div>
                  <div className="flex items-center gap-1">
                    <Square className="w-3 h-3" />
                    <span>{listing.sqft}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Overall Score - Compact */}
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-background">
          <div className="text-center">
            <Badge className="mb-2 text-xs" variant="secondary">
              AI Analysis
            </Badge>
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="text-3xl">{overallScore}</div>
              <div className="text-lg text-muted-foreground">/100</div>
            </div>
            <Progress value={overallScore} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">
              Good potential with proper strategy execution
            </p>
          </div>
        </Card>

        {/* Top Ratings - Compact */}
        <div className="grid md:grid-cols-2 gap-3">
          {topRatings.map((rating, index) => (
            <RatingCard key={index} {...rating} />
          ))}
        </div>

        {/* Chart - Compact */}
        <Card className="p-4">
          <h4 className="text-sm mb-3">Factor Performance</h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={categoryScores}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
