import { MapPin, Bed, Bath, Ruler, TrendingUp, Eye, Heart, Share2, Users, Sparkles, CheckCircle2, Camera, Clock } from "lucide-react";
import { CircularProgress } from "./CircularProgress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import houseImage from "../assets/luxury-house-twilight.jpg";

export function DashboardMockup() {
  // Sample data for preview
  const overallScore = 72;
  const streetAddress = "123 Oak Street";
  const cityState = "Springfield, IL";
  const price = "$395,000";
  const daysOnMarket = 61;
  const beds = 2;
  const baths = 2;
  const sqft = "1,204";

  const categoryScores = [
    { category: "Condition", score: 85 },
    { category: "Location", score: 85 },
    { category: "Amenities", score: 80 },
    { category: "Investment", score: 75 },
  ];

  const topPriorities = [
    "Optimize pricing strategy for faster sale",
    "Enhance digital marketing presence",
    "Improve property staging",
    "Target buyer demographics"
  ];

  const photoScores = [
    { name: "Living Room", score: 85 },
    { name: "Kitchen", score: 78 },
    { name: "Bedroom", score: 72 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[600px] md:max-h-none">
      {/* Browser Header */}
      <div className="p-2 md:p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-400" />
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-2 md:mx-4 hidden sm:block">
            <div className="bg-white rounded-lg px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs text-slate-500 border border-slate-200 truncate">
              smartrealtortool.com/dashboard
            </div>
          </div>
          <div className="text-[10px] md:text-xs text-slate-400 hidden sm:block">Dashboard</div>
        </div>
      </div>

      {/* Dashboard Content - Non-scrollable, fits container */}
      <div className="p-3 md:p-6 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
        {/* Property Header Section */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-lg overflow-hidden mb-2 md:mb-4">
          <div className="grid lg:grid-cols-3 gap-2 md:gap-4 p-2 md:p-4">
            {/* Column 1: Image only on desktop, Image and Score on mobile */}
            <div className="flex gap-2 md:gap-4 items-start">
              {/* Property Image - Wider, covers more width */}
              <div className="flex-shrink-0 w-48 h-32 md:w-72 md:h-40">
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <img
                    src={houseImage}
                    alt={streetAddress}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Circular Progress Score - Only visible on mobile */}
              <div className="flex flex-col flex-1 lg:hidden">
                <div className="text-center">
                  <CircularProgress 
                    percentage={overallScore} 
                    size={80} 
                    strokeWidth={12}
                    showAnimation={false}
                  />
                  <div className="mt-1 md:mt-2">
                    <div className="text-[10px] md:text-xs text-slate-600 mb-0.5">Smart AI Listing Score</div>
                    <div className="text-[9px] md:text-[10px] text-slate-500">Good</div>
                  </div>
                </div>
                {/* Analysis message - moved down a tiny bit and aligned with address */}
                <div className="mt-3 md:mt-4">
                  <div className="bg-blue-50/50 rounded-lg p-1 md:p-1.5 max-w-[160px] md:max-w-[200px]">
                    <p className="text-[8px] md:text-[9px] text-slate-700 leading-tight">
                      This property shows strong potential with competitive pricing and good location appeal.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Property Details (closer to image on desktop) */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Mobile: Address section - aligned with analysis message */}
                <div className="lg:hidden mt-[calc(80px+0.25rem+0.75rem)] md:mt-[calc(80px+0.5rem+1rem)] mb-1 md:mb-1.5">
                  <h2 className="text-slate-900 text-sm md:text-lg font-semibold line-clamp-2 mb-0.5">{streetAddress}</h2>
                  <div className="flex items-center gap-1 text-slate-600">
                    <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3" />
                    <span className="text-[10px] md:text-xs line-clamp-1">{cityState}</span>
                  </div>
                </div>
                {/* Desktop: Address only */}
                <h2 className="hidden lg:block text-slate-900 mb-0.5 md:mb-1 text-sm md:text-lg font-semibold line-clamp-2">{streetAddress}</h2>
                <div className="hidden lg:flex items-center gap-1 text-slate-600 mb-2 md:mb-3">
                  <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  <span className="text-[10px] md:text-xs line-clamp-1">{cityState}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 md:gap-2 mb-2 md:mb-3">
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-1.5 md:p-2">
                    <div className="text-[9px] md:text-[10px] text-slate-600 mb-0.5">List Price</div>
                    <div className="text-slate-900 text-xs md:text-sm font-semibold">{price}</div>
                  </div>
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-1.5 md:p-2">
                    <div className="text-[9px] md:text-[10px] text-slate-600 mb-0.5">Days on Market</div>
                    <div className="text-slate-900 text-xs md:text-sm font-semibold">{daysOnMarket} days</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1 md:gap-1.5">
                  <div className="bg-white rounded-lg p-1 md:p-1.5 text-center">
                    <Bed className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-600 mx-auto mb-0.5" />
                    <div className="text-[9px] md:text-[10px] text-slate-600">{beds} Beds</div>
                  </div>
                  <div className="bg-white rounded-lg p-1 md:p-1.5 text-center">
                    <Bath className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-600 mx-auto mb-0.5" />
                    <div className="text-[9px] md:text-[10px] text-slate-600">{baths} Baths</div>
                  </div>
                  <div className="bg-white rounded-lg p-1 md:p-1.5 text-center">
                    <Ruler className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-600 mx-auto mb-0.5" />
                    <div className="text-[9px] md:text-[10px] text-slate-600">{sqft} sqft</div>
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
                  strokeWidth={12}
                  showAnimation={true}
                />
                <div className="mt-1 md:mt-2">
                  <div className="text-[10px] md:text-xs text-slate-600 mb-0.5">Smart AI Listing Score</div>
                  <div className="text-[9px] md:text-[10px] text-slate-500">Good</div>
                </div>
              </div>
              {/* Analysis message */}
              <div className="mt-2 md:mt-3">
                <div className="bg-blue-50/50 rounded-lg p-1 md:p-1.5 max-w-[160px] md:max-w-[200px]">
                  <p className="text-[8px] md:text-[9px] text-slate-700 leading-tight">
                    This property shows strong potential with competitive pricing and good location appeal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Grid - Hidden on mobile, shown on larger screens */}
        <div className="hidden md:grid lg:grid-cols-3 gap-3 md:gap-4 mb-2 md:mb-4">
          {/* Performance Analytics */}
          <div className="lg:col-span-2 bg-white rounded-lg md:rounded-xl shadow-lg p-2 md:p-4">
            <h3 className="text-slate-900 mb-1 text-xs md:text-sm flex items-center gap-1 md:gap-1.5">
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
              Performance Analytics
            </h3>
            <p className="text-[9px] md:text-[10px] text-slate-600 mb-2 md:mb-3">7-day engagement overview</p>
            
            <div className="grid grid-cols-4 gap-1.5 md:gap-2 mb-3 md:mb-4">
              <div className="text-center p-1.5 md:p-2 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg">
                <Eye className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-600 mx-auto mb-0.5 md:mb-1" />
                <div className="text-slate-900 text-[10px] md:text-xs font-semibold">0</div>
                <div className="text-[8px] md:text-[9px] text-slate-600">Views</div>
              </div>
              <div className="text-center p-1.5 md:p-2 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg">
                <Heart className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-600 mx-auto mb-0.5 md:mb-1" />
                <div className="text-slate-900 text-[10px] md:text-xs font-semibold">0</div>
                <div className="text-[8px] md:text-[9px] text-slate-600">Favorites</div>
              </div>
              <div className="text-center p-1.5 md:p-2 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg">
                <Share2 className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-600 mx-auto mb-0.5 md:mb-1" />
                <div className="text-slate-900 text-[10px] md:text-xs font-semibold">0</div>
                <div className="text-[8px] md:text-[9px] text-slate-600">Shares</div>
              </div>
              <div className="text-center p-1.5 md:p-2 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg">
                <Users className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-600 mx-auto mb-0.5 md:mb-1" />
                <div className="text-slate-900 text-[10px] md:text-xs font-semibold">0</div>
                <div className="text-[8px] md:text-[9px] text-slate-600">Inquiries</div>
              </div>
            </div>

            <div className="h-24 md:h-32">
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
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-2 md:p-4">
            <h3 className="text-slate-900 mb-1 text-xs md:text-sm flex items-center gap-1 md:gap-1.5">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
              AI Insights
            </h3>
            <p className="text-[9px] md:text-[10px] text-slate-600 mb-2 md:mb-3">Smart recommendations</p>
            <div className="space-y-1.5 md:space-y-2">
              {topPriorities.slice(0, 2).map((priority, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-1.5 md:p-2">
                  <div className="flex items-start gap-1 md:gap-1.5">
                    <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-[9px] md:text-[10px] text-slate-900 leading-tight line-clamp-2">{priority}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Grid - Hidden on mobile */}
        <div className="hidden md:grid lg:grid-cols-2 gap-3 md:gap-4">
          {/* Photo Analysis */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-2 md:p-4">
            <h3 className="text-slate-900 mb-1 text-xs md:text-sm flex items-center gap-1 md:gap-1.5">
              <Camera className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
              Photo Quality
            </h3>
            <p className="text-[9px] md:text-[10px] text-slate-600 mb-2 md:mb-3">AI-scored photography</p>
            <div className="space-y-1.5 md:space-y-2">
              {photoScores.slice(0, 2).map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 md:gap-2">
                  <div className="text-[9px] md:text-[10px] text-slate-700 w-14 md:w-16 flex-shrink-0">{item.name}</div>
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5 md:h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <div className="text-[9px] md:text-[10px] text-slate-900 w-5 md:w-6">{item.score}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Marketing Timeline */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-2 md:p-4">
            <h3 className="text-slate-900 mb-1 text-xs md:text-sm flex items-center gap-1 md:gap-1.5">
              <Clock className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
              Timeline
            </h3>
            <p className="text-[9px] md:text-[10px] text-slate-600 mb-2 md:mb-3">Recent activity</p>
            <div className="space-y-1.5 md:space-y-2">
              {[
                { title: "Price optimization", date: "Today" },
              ].map((item, index) => (
                <div key={index} className="flex gap-1.5 md:gap-2">
                  <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 md:gap-1.5">
                      <div className="text-[9px] md:text-[10px] text-slate-900">{item.title}</div>
                      <div className="text-[8px] md:text-[9px] text-slate-500">{item.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}