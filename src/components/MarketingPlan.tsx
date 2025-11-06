import { Download, Calendar, Users, TrendingUp, DollarSign, Target, Zap, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

interface MarketingPlanProps {
  onNavigate: (view: "home" | "address-input" | "dashboard" | "marketing-plan") => void;
  onMenuClick?: () => void;
}

export function MarketingPlan({ onNavigate, onMenuClick }: MarketingPlanProps) {
  const weeklyPlan = [
    {
      week: 1,
      title: "Immediate Market Repositioning",
      actions: [
        {
          days: "Day 1-2",
          title: "Price Adjustment",
          tasks: [
            "Reduce to $379,000 (4% reduction) to create immediate market attention",
            "Position as 'Limited Time Opportunity' to create urgency",
            "Update all listings simultaneously with new pricing",
          ],
        },
        {
          days: "Day 3-4",
          title: "Enhanced Photography & Video",
          tasks: [
            "Professional twilight photography showcasing lake views",
            "Drone aerial footage of Island amenities",
            "2-minute cinematic video tour highlighting resort lifestyle",
          ],
        },
        {
          days: "Day 5-7",
          title: "Marketing Blitz Launch",
          tasks: [
            "Targeted Facebook/Instagram ads to Austin metro affluent demographics",
            "Email blast to 500+ local real estate investment groups",
            "Featured placement on luxury real estate platforms",
          ],
        },
      ],
    },
    {
      week: 2,
      title: "Expanded Reach & Targeting",
      actions: [
        {
          days: "Day 8-10",
          title: "Investor Outreach",
          tasks: [
            "Prepare detailed investment package with rental history, ROI projections",
            "Contact 50+ local property management companies",
            "Post on real estate investment forums and platforms",
          ],
        },
        {
          days: "Day 11-14",
          title: "Luxury Marketing Campaign",
          tasks: [
            "Feature in Austin luxury lifestyle publications",
            "Partner with local interior design/staging companies for open house",
            "Host exclusive 'VIP Preview Event' for high-net-worth prospects",
          ],
        },
      ],
    },
    {
      week: 3,
      title: "Incentive Drivers",
      actions: [
        {
          days: "Day 15-17",
          title: "Strategic Incentives",
          tasks: [
            "Offer $5,000 closing cost credit",
            "Include boat slip lease for 6 months (if available)",
            "Prepaid HOA fees for first year",
          ],
        },
        {
          days: "Day 18-21",
          title: "Intense Open House Schedule",
          tasks: [
            "Daily open houses (Weekends: 11am-4pm, Weekdays: 5pm-7pm)",
            "'Sundown Social' events showcasing evening lake views",
            "Private showings for qualified buyers",
          ],
        },
      ],
    },
    {
      week: 4,
      title: "Final Push",
      actions: [
        {
          days: "Day 22-25",
          title: "Urgency Campaign",
          tasks: [
            "'Multiple offers expected' messaging",
            "Deadline for all offers: Day 28",
            "Final price review based on showing activity and feedback",
          ],
        },
        {
          days: "Day 26-30",
          title: "Offer Negotiation & Closing",
          tasks: [
            "Multiple offer management strategy",
            "Quick closing timeline (21 days preferred)",
            "Backup offers secured",
          ],
        },
      ],
    },
  ];

  const buyerProfiles = [
    {
      title: "Austin Tech Professionals",
      age: "35-45 years",
      income: "$150,000+ annually",
      seeking: "Weekend getaway/second home",
      motivations: ["Luxury amenities", "Proximity to Austin (30-40 mins)"],
      valueDrivers: ["Turnkey convenience", "Resort lifestyle"],
    },
    {
      title: "Real Estate Investors",
      age: "40-60 years",
      income: "Various",
      seeking: "Short-term rental income property",
      motivations: ["Proven rental history", "Luxury positioning"],
      valueDrivers: ["HOA-managed amenities", "Vacation rental demand"],
    },
    {
      title: "Retirees/Empty Nesters",
      age: "55+ years",
      income: "$80,000+ (retirement/portfolio)",
      seeking: "Low-maintenance luxury lifestyle",
      motivations: ["Single-story living", "Comprehensive amenities"],
      valueDrivers: ["Lock-and-leave convenience", "Active adult lifestyle"],
    },
    {
      title: "Young Professional Couples",
      age: "30-40 years",
      income: "$120,000+ combined",
      seeking: "Primary residence with resort amenities",
      motivations: ["Luxury living without maintenance burden"],
      valueDrivers: ["Updated finishes", "Waterfront lifestyle"],
    },
  ];

  const investmentAnalysis = {
    rentalIncome: {
      nightlyRate: "$250-350",
      occupancyRate: "70-75%",
      annualGross: "$63,875-95,500",
      netOperating: "$45,000-65,000",
      capRate: "11.4-16.4%",
    },
    marketPosition: {
      similarUnits: "$285,000-306,700",
      waterfrontPremium: "25-30%",
      amenityPremium: "15-20%",
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation currentView="marketing-plan" onNavigate={onNavigate} onMenuClick={onMenuClick} />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <Badge className="mb-4">Premium Plan Unlocked</Badge>
          <h2 className="mb-2">
            30-Day Action Plan for 3404 American Dr APT 1105
          </h2>
          <p className="text-lg text-muted-foreground">
            Tailored strategy to increase sale probability from 40% to 85%
          </p>
        </div>

        {/* Success Metrics */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-primary/5 to-background">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">85%</div>
              <div className="text-sm text-muted-foreground">Success Probability</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">21-28</div>
              <div className="text-sm text-muted-foreground">Days to Offer</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">$379K</div>
              <div className="text-sm text-muted-foreground">Recommended Price</div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="action-plan" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="action-plan">
              <Calendar className="w-4 h-4 mr-2" />
              Action Plan
            </TabsTrigger>
            <TabsTrigger value="buyers">
              <Users className="w-4 h-4 mr-2" />
              Target Buyers
            </TabsTrigger>
            <TabsTrigger value="investment">
              <DollarSign className="w-4 h-4 mr-2" />
              Investment Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="action-plan" className="space-y-6 mt-6">
            {weeklyPlan.map((week) => (
              <Card key={week.week} className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-lg text-primary-foreground">W{week.week}</span>
                  </div>
                  <div>
                    <h3 className="mb-1">{week.title}</h3>
                    <p className="text-sm text-muted-foreground">Week {week.week} of 4</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {week.actions.map((action, idx) => (
                    <div key={idx}>
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="secondary">{action.days}</Badge>
                        <span className="font-medium">{action.title}</span>
                      </div>
                      <div className="space-y-2 ml-4">
                        {action.tasks.map((task, taskIdx) => (
                          <div key={taskIdx} className="flex items-start gap-3">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-muted-foreground">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="buyers" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {buyerProfiles.map((profile, idx) => (
                <Card key={idx} className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="mb-1">{profile.title}</h3>
                      <p className="text-sm text-muted-foreground">{profile.age}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium mb-1">Income Level</div>
                      <p className="text-sm text-muted-foreground">{profile.income}</p>
                    </div>
                    <Separator />
                    <div>
                      <div className="text-sm font-medium mb-1">Seeking</div>
                      <p className="text-sm text-muted-foreground">{profile.seeking}</p>
                    </div>
                    <Separator />
                    <div>
                      <div className="text-sm font-medium mb-2">Key Motivations</div>
                      <div className="space-y-1">
                        {profile.motivations.map((motivation, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {motivation}
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <div className="text-sm font-medium mb-2">Value Drivers</div>
                      <div className="space-y-1">
                        {profile.valueDrivers.map((driver, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {driver}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6 bg-muted/50">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="mb-2">Marketing Priority</div>
                  <p className="text-sm text-muted-foreground">
                    Focus 40% of marketing budget on Austin Tech Professionals and Real Estate Investors, 
                    30% on Retirees, and 30% on Young Professional Couples. Austin Tech Professionals have 
                    highest conversion rate for weekend getaway properties.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="investment" className="space-y-6 mt-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h3>Rental Income Potential</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Estimated Nightly Rate</div>
                    <div className="text-2xl">{investmentAnalysis.rentalIncome.nightlyRate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Target Occupancy Rate</div>
                    <div className="text-2xl">{investmentAnalysis.rentalIncome.occupancyRate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Annual Gross Income</div>
                    <div className="text-2xl">{investmentAnalysis.rentalIncome.annualGross}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Net Operating Income</div>
                    <div className="text-2xl">{investmentAnalysis.rentalIncome.netOperating}</div>
                    <p className="text-xs text-muted-foreground mt-1">After HOA, taxes, management</p>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Cap Rate</div>
                    <div className="text-2xl text-primary">{investmentAnalysis.rentalIncome.capRate}</div>
                    <p className="text-xs text-muted-foreground mt-1">At current asking price</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <h3>Comparable Market Analysis</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="text-sm">Similar Units (non-waterfront)</span>
                  <span className="font-medium">{investmentAnalysis.marketPosition.similarUnits}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="text-sm">Waterfront Premium</span>
                  <span className="font-medium text-primary">{investmentAnalysis.marketPosition.waterfrontPremium}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="text-sm">Resort Amenity Premium</span>
                  <span className="font-medium text-primary">{investmentAnalysis.marketPosition.amenityPremium}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="mb-2">Investment Positioning Strategy</div>
                  <p className="text-sm text-muted-foreground">
                    Market this property as a premium investment opportunity with documented ROI potential. 
                    The 11.4-16.4% cap rate significantly exceeds typical residential real estate returns (4-6%). 
                    Create professional investment packages with these figures for investor outreach during Week 2.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Critical Success Factors */}
        <Card className="p-6">
          <h3 className="mb-6">Critical Success Factors</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge>Immediate Actions</Badge>
                <span className="text-sm text-muted-foreground">(First 72 Hours)</span>
              </div>
              <div className="space-y-2">
                {[
                  "Price adjustment to $379,000",
                  "Professional twilight photo session",
                  "Targeted digital ad campaign launch",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge>Ongoing Strategies</Badge>
              </div>
              <div className="space-y-2">
                {[
                  "Daily social media content showcasing lifestyle",
                  "Weekly investment performance updates",
                  "Continuous competitive market analysis",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">Backup Plans</Badge>
              </div>
              <div className="space-y-2">
                {[
                  "If no offers by Day 15: Additional 3% price reduction",
                  "If limited showing activity: Expand marketing radius to Dallas/Houston",
                  "If financing challenges emerge: Offer seller financing options",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </main>
        <Footer />
    </div>
  );
}
