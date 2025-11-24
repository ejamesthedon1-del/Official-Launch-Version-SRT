import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  CheckCircle,
  Star,
  Home,
  BarChart3,
  FileText,
  MapPin,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  Users,
  Sparkles,
  CheckCircle2,
  Camera,
  Clock,
  Bed,
  Bath,
  Ruler,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { supabase } from "../lib/supabaseClient";
import homeHeroImage from "../assets/AdobeStock_837239185.png";
import { DashboardPreview } from "./DashboardPreview";
import { Logo } from "./figma/Logo";
import { SlidingInfoSection } from "./SlidingInfoSection";
import { CircularProgress } from "./CircularProgress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import CursorIcon from "./CursorIcon";
import FactsSection from "./FactsSection";
import FAQSection from "./FAQSection";

// Animated Address Input Component for Step 1
function AnimatedAddressInput() {
  const [cursorPosition, setCursorPosition] = useState({ x: 30, y: 40 });
  const [isClicked, setIsClicked] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showTextCursor, setShowTextCursor] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const animationRef = useRef<{
    moveInterval?: NodeJS.Timeout;
    typeInterval?: NodeJS.Timeout;
    blinkInterval?: NodeJS.Timeout;
    clickTimeout?: NodeJS.Timeout;
    resetTimeout?: NodeJS.Timeout;
    suggestionsTimeout?: NodeJS.Timeout;
  }>({});

  const exampleAddress = "123 Oak Street";
  const suggestions = [
    {
      main: "123 Oak Street APT 4B",
      secondary: "Springfield, IL 62701"
    },
    {
      main: "123 Oak Street",
      secondary: "Springfield, IL"
    },
    {
      main: "123 Oak Avenue",
      secondary: "Springfield, IL"
    }
  ];

  useEffect(() => {
    const cleanup = () => {
      if (animationRef.current.moveInterval) clearInterval(animationRef.current.moveInterval);
      if (animationRef.current.typeInterval) clearInterval(animationRef.current.typeInterval);
      if (animationRef.current.blinkInterval) clearInterval(animationRef.current.blinkInterval);
      if (animationRef.current.clickTimeout) clearTimeout(animationRef.current.clickTimeout);
      if (animationRef.current.resetTimeout) clearTimeout(animationRef.current.resetTimeout);
      if (animationRef.current.suggestionsTimeout) clearTimeout(animationRef.current.suggestionsTimeout);
      animationRef.current = {};
    };

    const startAnimation = () => {
      cleanup();
      setShowSuggestions(false);
      
      // Move cursor to input field center (approximately 50% left, 62% top)
      const targetX = 50;
      const targetY = 62;
      const startX = 30;
      const startY = 40;
      const moveDuration = 1800;
      const moveSteps = 60;
      let step = 0;
      
      animationRef.current.moveInterval = setInterval(() => {
        step++;
        const progress = step / moveSteps;
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
        
        setCursorPosition({
          x: startX + (targetX - startX) * easeProgress,
          y: startY + (targetY - startY) * easeProgress,
        });
        
        if (step >= moveSteps) {
          clearInterval(animationRef.current.moveInterval!);
          
          // Click animation
          animationRef.current.clickTimeout = setTimeout(() => {
            setIsClicked(true);
            setTimeout(() => {
              setIsClicked(false);
              setIsTyping(true);
              
              // Start typing
              let charIndex = 0;
              animationRef.current.typeInterval = setInterval(() => {
                if (charIndex < exampleAddress.length) {
                  setTypedText(exampleAddress.substring(0, charIndex + 1));
                  charIndex++;
                  
                  // Show suggestions after typing a few characters
                  if (charIndex >= 3) {
                    setShowSuggestions(true);
                  }
                } else {
                  clearInterval(animationRef.current.typeInterval!);
                  setIsTyping(false);
                  
                  // Blink cursor after typing completes
                  animationRef.current.blinkInterval = setInterval(() => {
                    setShowTextCursor((prev) => !prev);
                  }, 530);
                  
                  // Reset animation after showing completed text
                  animationRef.current.resetTimeout = setTimeout(() => {
                    cleanup();
                    // Reset everything to restart animation
                    setTypedText("");
                    setShowSuggestions(false);
                    setCursorPosition({ x: 30, y: 40 });
                    setShowTextCursor(true);
                    // Restart animation
                    setTimeout(() => {
                      startAnimation();
                    }, 1000);
                  }, 5000);
                }
              }, 80); // Typing speed
            }, 150);
          }, 200);
        }
      }, moveDuration / moveSteps);
    };

    // Start animation after initial delay
    const initialDelay = setTimeout(() => {
      startAnimation();
    }, 800);

    return () => {
      clearTimeout(initialDelay);
      cleanup();
    };
  }, [exampleAddress]);

  return (
    <>
      <div className="bg-slate-300 rounded-3xl p-4 mb-6 shadow-xl overflow-hidden aspect-square flex items-center justify-center relative">
        {/* White overlay fade effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/20 pointer-events-none z-10 rounded-3xl" />
        {/* Shadow fade effect on top */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/5 via-black/2 to-transparent pointer-events-none z-20 rounded-t-3xl" />
        {/* Address Input mockup */}
        <div className="w-full h-full">
          {/* Browser chrome */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col relative border border-slate-200">
            {/* Address Input content */}
            <div className="flex-1 overflow-hidden relative bg-white p-4 md:p-6">
              <div className="h-full flex flex-col items-center justify-center">
                {/* Header */}
                <div className="text-center mb-6">
                  <Badge className="mb-3 text-xs">Step 1 of 2</Badge>
                  <h2 className="text-lg md:text-xl text-slate-900 mb-2">Enter Your Property Address</h2>
                  <p className="text-xs md:text-sm text-slate-600">
                    Our AI will analyze your listing in seconds
                  </p>
                </div>

                {/* Address Input Form */}
                <div className="w-full max-w-sm">
                  <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6 shadow-sm">
                    <div className="space-y-3">
                      <label className="text-xs md:text-sm font-medium text-slate-700 block">
                        Property Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                        <div className="relative">
                          <input
                            type="text"
                            value={typedText}
                            placeholder={typedText ? "" : "123 Main Street, City, State ZIP"}
                            className="w-full pl-10 pr-8 py-2.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            readOnly
                            style={{
                              borderColor: isTyping || typedText ? "#3b82f6" : undefined,
                              boxShadow: isTyping || typedText ? "0 0 0 3px rgba(59, 130, 246, 0.1)" : undefined,
                              color: typedText ? "transparent" : undefined, // Hide input text to show overlay
                            }}
                          />
                          {/* Visible typed text with cursor - positioned to match input */}
                          {typedText && (
                            <div 
                              className="absolute left-10 right-8 top-1/2 -translate-y-1/2 text-sm text-slate-900 pointer-events-none flex items-center overflow-hidden"
                            >
                              <span className="truncate">{typedText}</span>
                              {showTextCursor && (isTyping || typedText) && (
                                <span className="inline-block w-0.5 h-4 bg-blue-600 ml-0.5 flex-shrink-0 animate-pulse" />
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Google-style Autosuggest Dropdown */}
                        {showSuggestions && typedText.length >= 3 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-xl z-50 overflow-hidden">
                            {suggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                className="px-3 py-2.5 hover:bg-slate-50 transition-colors flex items-start gap-2.5 cursor-pointer border-b border-slate-100 last:border-b-0"
                              >
                                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs text-slate-900 font-medium leading-tight">
                                    {suggestion.main}
                                  </div>
                                  <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                    {suggestion.secondary}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        Start typing to see address suggestions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Realistic Mouse Pointer Cursor - Animated */}
            <div
              className="absolute z-50 pointer-events-none"
              style={{
                left: `${cursorPosition.x}%`,
                top: `${cursorPosition.y}%`,
                transform: "translate(0, 0)",
                transition: "opacity 0.2s ease-out",
                opacity: isTyping || typedText ? 0 : 1,
              }}
            >
              <div 
                className="relative pointer-events-none"
                style={{
                  transform: isClicked ? "scale(0.9)" : "scale(1)",
                  transition: "transform 0.1s ease-out",
                  filter: "drop-shadow(0.5px 0.5px 1px rgba(0,0,0,0.5))",
                }}
              >
                {/* Mouse pointer cursor */}
                <CursorIcon
                  width={20}
                  height={20}
                  color="#000000"
                />
                {/* Click ripple effect */}
                {isClicked && (
                  <div className="absolute top-2.5 left-2.5 flex items-center justify-center -z-10">
                    <div className="w-7 h-7 bg-blue-500 rounded-full opacity-25 animate-ping" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Transform Gemini AI response to Dashboard's expected format
function transformAnalysisData(address: string, geminiData: any): any {
  // If it already has the correct structure, return it
  if (geminiData.listing && geminiData.overallScore) {
    let imageUrl = null;
    if (geminiData.propertyPhotos && Array.isArray(geminiData.propertyPhotos) && geminiData.propertyPhotos.length > 0) {
      imageUrl = geminiData.propertyPhotos[0];
    } else if (geminiData.propertyImageUrl) {
      imageUrl = geminiData.propertyImageUrl;
    }
    geminiData.listing.imageUrl = imageUrl;
    return geminiData;
  }

  const addressParts = address.split(",");
  const city = addressParts.length > 1 ? addressParts[addressParts.length - 2]?.trim() || "Unknown" : "Unknown";
  const estimatedValue = geminiData.estimatedPrice || geminiData.estimatedValue || 0;
  
  const parseNumber = (value: any, defaultValue: number = 0): number => {
    if (typeof value === 'number' && !isNaN(value)) return Math.max(0, value);
    if (value === null || value === undefined) return defaultValue;
    const parsed = parseFloat(value);
    return !isNaN(parsed) ? Math.max(0, parsed) : defaultValue;
  };
  
  const beds = Math.round(parseNumber(geminiData.beds, 0));
  const baths = parseNumber(geminiData.baths, 0);
  const sqft = Math.round(parseNumber(geminiData.sqft, 0));
  const daysOnMarket = Math.round(parseNumber(geminiData.daysOnMarket, 0));
  const pricePerSqft = sqft > 0 && estimatedValue > 0 ? Math.round(estimatedValue / sqft) : 0;
  
  const daysOnMarketScore = daysOnMarket <= 14 ? 90 : daysOnMarket <= 30 ? 70 : daysOnMarket <= 60 ? 50 : 30;
  const pricingStrategyScore = 80;
  const marketTrendScore = 70;
  const propertyAppealScore = 80;
  
  const overallScore = Math.round(
    (daysOnMarketScore * 0.40) + 
    (pricingStrategyScore * 0.30) + 
    (marketTrendScore * 0.20) + 
    (propertyAppealScore * 0.10)
  );
  
  let imageUrl = null;
  if (geminiData.propertyPhotos && Array.isArray(geminiData.propertyPhotos) && geminiData.propertyPhotos.length > 0) {
    imageUrl = geminiData.propertyPhotos[0];
  } else if (geminiData.propertyImageUrl) {
    imageUrl = geminiData.propertyImageUrl;
  }

  return {
    listing: {
      address: address,
      city: city,
      propertyType: geminiData.propertyType || "Residential",
      price: estimatedValue > 0 ? `$${estimatedValue.toLocaleString()}` : "Price not available",
      pricePerSqft: pricePerSqft > 0 ? `$${pricePerSqft.toLocaleString()}` : "N/A",
      beds: beds,
      baths: baths,
      sqft: sqft > 0 ? sqft.toLocaleString() : "N/A",
      daysOnMarket: daysOnMarket,
      imageUrl: imageUrl
    },
    overallScore: overallScore,
    ratings: [
      {
        title: "Days on Market",
        score: daysOnMarket <= 14 ? 9 : daysOnMarket <= 30 ? 7 : daysOnMarket <= 60 ? 5 : 3,
        maxScore: 10,
        category: "Speed",
        description: `${daysOnMarket} days on market${daysOnMarket > 30 ? ' - Above average, action recommended' : daysOnMarket > 60 ? ' - High DOM, urgent action needed' : ''}`
      },
      {
        title: "Pricing Strategy",
        score: 8,
        maxScore: 10,
        category: "Pricing",
        description: geminiData.pricingInsight || "Pricing analysis available"
      },
      {
        title: "Market Trend",
        score: 7,
        maxScore: 10,
        category: "Market",
        description: geminiData.marketTrend || "Stable market"
      },
      {
        title: "Property Appeal",
        score: 8,
        maxScore: 10,
        category: "Features",
        description: geminiData.keyFeatures?.join(", ") || "Standard features"
      }
    ],
    categoryScores: [
      { category: "Days on Market", score: daysOnMarketScore },
      { category: "Pricing Strategy", score: pricingStrategyScore },
      { category: "Market Trend", score: marketTrendScore },
      { category: "Property Appeal", score: propertyAppealScore }
    ],
    radarData: [
      { subject: "Pricing", A: 8, fullMark: 10 },
      { subject: "Market Position", A: 7, fullMark: 10 },
      { subject: "Property Appeal", A: 8, fullMark: 10 },
      { subject: "Speed of Sale", A: daysOnMarket <= 14 ? 9 : daysOnMarket <= 30 ? 7 : daysOnMarket <= 60 ? 5 : 3, fullMark: 10 }
    ],
    insights: {
      summary: geminiData.summary || `This property has been on the market for ${daysOnMarket} days. ${geminiData.pricingInsight || 'Pricing strategy should be evaluated against current market conditions.'} ${geminiData.marketTrend || 'Market conditions play a crucial role in determining the optimal selling strategy.'} ${geminiData.keyFeatures?.length > 0 ? `The property offers ${geminiData.keyFeatures.slice(0, 2).join(' and ')}.` : 'Property features significantly impact buyer interest.'} Strategic improvements can help accelerate the sale process.`,
      alerts: [
        ...(daysOnMarket > 60 ? [{
          type: "error",
          title: "Urgent: High Days on Market",
          message: `Property has been on market ${daysOnMarket} days (60+ days). Immediate pricing or positioning action required.`
        }] : []),
        ...(daysOnMarket > 30 && daysOnMarket <= 60 ? [{
          type: "warning",
          title: "Warning: Above Average Days on Market",
          message: `Property has been on market ${daysOnMarket} days (above 30-day threshold). Consider pricing strategy review.`
        }] : []),
        ...(geminiData.riskFactors?.map((risk: string) => ({
          type: "warning",
          title: "Risk Factor",
          message: risk
        })) || [])
      ],
      topPriorities: geminiData.recommendations || ["Review property details", "Check market conditions"],
      pricingInsight: geminiData.pricingInsight || null,
      sellingSpeedPrediction: geminiData.sellingSpeedPrediction || null
    }
  };
}

interface Prediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface HomePageProps {
  onGetStarted: () => void;
  onAnalyze: (address: string, analysisData: any) => void;
  onNavigate: (
    view: "home" | "address-input" | "dashboard"
  ) => void;
  onMenuClick?: () => void;
}

export function HomePage({
  onGetStarted,
  onAnalyze,
  onNavigate,
  onMenuClick,
}: HomePageProps) {
  const [address, setAddress] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced autocomplete
  useEffect(() => {
    const fetchPredictions = async () => {
      if (address.length < 3) {
        setPredictions([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke(
          "make-server-52cdd920/places-autocomplete",
          {
            body: { input: address },
          }
        );

        if (error) {
          console.error("Autocomplete error:", error);
          return;
        }

        setPredictions(data?.predictions || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Error fetching autocomplete:", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchPredictions, 300);
    return () => clearTimeout(timer);
  }, [address]);

  const handleSelectPrediction = (prediction: Prediction) => {
    setAddress(prediction.description);
    setSelectedPlaceId(prediction.place_id);
    setShowSuggestions(false);
    setPredictions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setAnalyzing(true);
    try {
      const { data: analysisData, error } = await supabase.functions.invoke(
        "make-server-52cdd920/analyze-listing",
        {
          body: { 
            address,
            placeId: selectedPlaceId || undefined
          },
        }
      );

      if (error) {
        console.error("Analysis error:", error);
        toast.error("Failed to analyze listing. Please try again.");
        setAnalyzing(false);
        return;
      }

      if (analysisData?.result) {
        const transformedData = transformAnalysisData(address, analysisData.result);
        setTimeout(() => {
          setAnalyzing(false);
          onAnalyze(address, transformedData);
        }, 500);
      } else if (analysisData) {
        const transformedData = transformAnalysisData(address, analysisData);
        setTimeout(() => {
          setAnalyzing(false);
          onAnalyze(address, transformedData);
        }, 500);
      } else {
        throw new Error("No data received from analysis");
      }
    } catch (err: any) {
      console.error("Error analyzing listing:", err);
      toast.error(`Failed to analyze listing: ${err?.message || "Unknown error"}`);
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Luxury Real Estate Agent",
      content:
        "The AI analysis helped me identify pricing issues I missed. My listing sold 40% faster!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "RE/MAX Broker",
      content:
        "The buyer demographic insights were spot-on. We adjusted our marketing and got multiple offers.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Independent Realtor",
      content:
        "Game changer for my business. The 30-day action plan is worth every penny.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Integrated Header */}
      <section className="relative bg-gradient-to-b from-[#e0f2fe] via-[#dbeafe] to-[#d1e7ff] overflow-hidden">
        {/* Navigation */}
        <div className="relative z-10">
          <div className="container mx-auto max-w-6xl px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-white" style={{ gap: '2px' }}>
                <div className="w-12 h-12 flex items-center justify-center">
                  <Logo />
                </div>
                <span className="tracking-tight">Smart Realtor Tools</span>
              </div>
              <div className="hidden md:flex items-center gap-8 text-white/90 text-sm">
                <button 
                  onClick={() => onNavigate("home")}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
                <button 
                  onClick={() => onNavigate("address-input")}
                  className="hover:text-white transition-colors"
                >
                  Analyze Listing
                </button>
                <button 
                  onClick={() => onNavigate("dashboard")}
                  className="hover:text-white transition-colors"
                >
                  Dashboard
                </button>
              </div>

              {/* Mobile Hamburger Menu */}
              <button
                onClick={() => {
                  if (onMenuClick) {
                    onMenuClick();
                  }
                }}
                className="md:hidden flex flex-col gap-1.5 p-3 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                aria-label="Menu"
                type="button"
              >
                <span className="w-6 h-0.5 bg-white rounded-full" />
                <span className="w-6 h-0.5 bg-white rounded-full" />
              </button>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto max-w-4xl px-4 pt-6 pb-12 text-center relative z-10">
          <h1 className="text-[45px] md:text-6xl lg:text-7xl text-white mb-6">
          See where your listing stand.
          <br />
          No more guessing.
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
    
          Optimize every listing and
          <br />
          sell faster with confidence.
          </p>
          
          {/* Address Input Form */}
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto mb-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="123 Main Street, City, State ZIP"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (selectedPlaceId) {
                    setSelectedPlaceId(null);
                  }
                }}
                onFocus={() => {
                  if (predictions.length > 0) setShowSuggestions(true);
                }}
                className="pl-10 pr-9 w-full h-11 text-sm bg-white/95 backdrop-blur-sm border-white/20 text-gray-900 placeholder:text-gray-400"
                disabled={analyzing}
                required
                autoComplete="off"
              />
              {loading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
              )}

              {showSuggestions && predictions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto"
                >
                  {predictions.map((prediction) => (
                    <button
                      key={prediction.place_id}
                      type="button"
                      onClick={() => handleSelectPrediction(prediction)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3"
                    >
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-900">
                          {prediction.structured_formatting.main_text}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {prediction.structured_formatting.secondary_text}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              type="submit"
              size="default"
              className="w-full mt-3 bg-white text-blue-600 hover:bg-slate-50 shadow-xl gap-2 h-11"
              disabled={!address.trim() || analyzing}
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Property...
                </>
              ) : (
                <>
                  Analyze My Listing <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Home Image Preview */}
        <div className="w-full relative z-10 pb-4 md:pb-8">
          <div className="relative w-full">
            {/* Image */}
            <div className="relative w-full">
              <img 
                src={homeHeroImage} 
                alt="Modern home" 
                className="w-full h-auto object-cover"
              />
              
              {/* Animated Score Bar Mock - Top Right */}
              <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
                <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-3 md:p-4 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-1000">
                  <CircularProgress 
                    percentage={78}
                    size={80}
                    strokeWidth={8}
                    showAnimation={true}
                  />
                  <div className="mt-2 text-center">
                    <div className="text-[10px] md:text-xs text-slate-700 font-medium mb-0.5">AI Smart Listing Score</div>
                    <div className="text-[9px] md:text-[10px] text-slate-500">Very Good</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade to white - covers blue background transition to next section */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 md:h-40 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 25%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0.3) 75%, rgba(255, 255, 255, 0.1) 90%, transparent 100%)'
          }}
        />
      </section>

      {/* Sliding Info Section */}
      <SlidingInfoSection />

      {/* Sell Faster in 3 Steps */}
      <section className="min-h-screen bg-white pt-12 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-slate-900 mb-6">
              Sell faster in 3 steps
            </h2>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Optimize every listing and
              <br />
              sell faster with confidence.
            </p>
          </div>

          {/* Steps */}
          <div className="grid lg:grid-cols-3 gap-16 items-start mb-16">
            {/* Step 1: Analyze Listing */}
            <div className="relative">
              <AnimatedAddressInput />
              {/* Arrow to next step - hidden on mobile */}
              <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 z-10">
                <ArrowRight className="w-12 h-12 text-slate-400" />
              </div>
              {/* Step label */}
              <div className="text-left mt-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-xl md:text-2xl text-slate-900">1</div>
                  <h3 className="text-2xl md:text-3xl font-medium text-slate-900">Analyze listing</h3>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-xl md:text-2xl text-slate-900 opacity-0">1</div>
                  <p className="text-base text-slate-600 max-w-md">
                    Simply enter your property<br />
                    address to get started
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Get Listing Score */}
            <div className="relative">
              <div className="bg-slate-300 rounded-3xl p-4 mb-6 shadow-xl overflow-hidden aspect-square flex items-center justify-center relative border border-slate-200">
                {/* White overlay fade effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/20 pointer-events-none z-10 rounded-3xl" />
                {/* Shadow fade effect on top */}
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/5 via-black/2 to-transparent pointer-events-none z-20 rounded-t-3xl" />
                {/* Desktop Browser Mockup */}
                <div className="w-full h-full">
                  {/* Browser chrome */}
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col relative border border-slate-200">
                    {/* Browser controls */}
                    <div className="bg-slate-100 px-3 py-2 flex items-center gap-2 border-b border-slate-200 flex-shrink-0">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                      </div>
                    </div>
                    
                    {/* Dashboard content - scaled down */}
                    <div className="flex-1 overflow-hidden relative bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-3 md:p-4">
                      <div className="bg-white rounded-xl shadow-lg border border-slate-200/50 overflow-hidden h-full flex items-center justify-center">
                        <div className="text-center">
                          <CircularProgress 
                            percentage={85} 
                            size={180} 
                            strokeWidth={14}
                            showAnimation={false}
                          />
                          <div className="mt-3">
                            <div className="text-xs text-slate-600 mb-1">AI Listing Score</div>
                            <div className="text-[10px] text-slate-500">Very Good</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Arrow to next step - hidden on mobile */}
              <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 z-10">
                <ArrowRight className="w-12 h-12 text-slate-400" />
              </div>
              {/* Step label */}
              <div className="text-left mt-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-xl md:text-2xl text-slate-900">2</div>
                  <h3 className="text-2xl md:text-3xl font-medium text-slate-900">Get your listing score</h3>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-xl md:text-2xl text-slate-900 opacity-0">2</div>
                  <p className="text-base text-slate-600 max-w-md">
                    Analyze your listing's strengths<br />
                    and weaknesses
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Get Marketing Plan */}
            <div className="relative">
              <div className="bg-slate-300 rounded-3xl p-3 md:p-4 mb-6 shadow-xl overflow-hidden aspect-square flex items-start justify-center relative border border-slate-200">
                {/* White overlay fade effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/20 pointer-events-none z-10 rounded-3xl" />
                {/* Shadow fade effect on top */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/5 via-black/2 to-transparent pointer-events-none z-20 rounded-t-3xl" />
                {/* PDF Marketing Plan Mockup - Letter Size (8.5" x 11" ratio) */}
                <div 
                  className="overflow-hidden bg-white rounded-xl shadow-lg border border-slate-200 relative mt-4"
                  style={{
                    width: "85%",
                    aspectRatio: "8.5 / 11", // Letter size ratio
                    maxHeight: "95%",
                  }}
                >
                  {/* PDF Document Header */}
                  <div className="bg-white px-3 py-2 border-b border-slate-200">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-3 h-3 text-slate-700" />
                      <div className="text-[10px] text-slate-900 font-medium">30-day marketing plan</div>
                    </div>
                    <div className="text-[9px] text-slate-600">123 Oak Street, Springfield, IL</div>
                  </div>
                  
                  {/* PDF Content */}
                  <div className="p-3 overflow-hidden bg-white" style={{ height: 'calc(100% - 60px)' }}>
                    {/* Headlines Only with Placeholder Boxes */}
                    <div className="space-y-4">
                      {/* Week 1 Headline */}
                      <div>
                        <div className="text-[11px] font-semibold text-slate-900 mb-2">Week 1: immediate market repositioning</div>
                        <div className="space-y-1.5">
                          <div className="h-2 bg-slate-200 rounded w-full" />
                          <div className="h-2 bg-slate-200 rounded w-4/5" />
                          <div className="h-2 bg-slate-200 rounded w-3/4" />
                      </div>
                    </div>

                      {/* Week 2 Headline */}
                      <div>
                        <div className="text-[11px] font-semibold text-slate-900 mb-2">Week 2: expanded reach & targeting</div>
                        <div className="space-y-1.5">
                          <div className="h-2 bg-slate-200 rounded w-full" />
                          <div className="h-2 bg-slate-200 rounded w-4/5" />
                          <div className="h-2 bg-slate-200 rounded w-3/4" />
                        </div>
                      </div>

                      {/* Week 3 Headline */}
                      <div>
                        <div className="text-[11px] font-semibold text-slate-900 mb-2">Week 3: strategic incentives</div>
                        <div className="space-y-1.5">
                          <div className="h-2 bg-slate-200 rounded w-full" />
                          <div className="h-2 bg-slate-200 rounded w-4/5" />
                          <div className="h-2 bg-slate-200 rounded w-3/4" />
                        </div>
                        </div>

                      {/* Week 4 Headline */}
                      <div>
                        <div className="text-[11px] font-semibold text-slate-900 mb-2">Week 4: closing & follow-up</div>
                        <div className="space-y-1.5">
                          <div className="h-2 bg-slate-200 rounded w-full" />
                          <div className="h-2 bg-slate-200 rounded w-4/5" />
                          <div className="h-2 bg-slate-200 rounded w-3/4" />
                      </div>
                    </div>

                      {/* Additional Sections */}
                      <div>
                        <div className="text-[11px] font-semibold text-slate-900 mb-2">Marketing channels</div>
                        <div className="space-y-1.5">
                          <div className="h-2 bg-slate-200 rounded w-full" />
                          <div className="h-2 bg-slate-200 rounded w-4/5" />
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] font-semibold text-slate-900 mb-2">Budget allocation</div>
                        <div className="space-y-1.5">
                          <div className="h-2 bg-slate-200 rounded w-full" />
                          <div className="h-2 bg-slate-200 rounded w-3/4" />
                      </div>
                    </div>

                      {/* Additional content to show bottom cut off */}
                      <div>
                        <div className="text-[11px] font-semibold text-slate-900 mb-2">Success metrics</div>
                        <div className="space-y-1.5">
                          <div className="h-2 bg-slate-200 rounded w-full" />
                          <div className="h-2 bg-slate-200 rounded w-4/5" />
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] font-semibold text-slate-900 mb-2">Timeline overview</div>
                        <div className="space-y-1.5">
                          <div className="h-2 bg-slate-200 rounded w-full" />
                          <div className="h-2 bg-slate-200 rounded w-3/4" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* PDF Page Edge Shadow */}
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-r from-transparent via-slate-300/50 to-slate-400/30 pointer-events-none" />
                </div>
              </div>
              {/* Step label */}
              <div className="text-left mt-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-xl md:text-2xl text-slate-900">3</div>
                  <h3 className="text-2xl md:text-3xl font-medium text-slate-900">Get your tailored<br />marketing plan</h3>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-xl md:text-2xl text-slate-900 opacity-0">3</div>
                  <p className="text-base text-slate-600 max-w-md">
                    Access your complete dashboard<br />
                    with insights and analytics
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Listing Intelligence */}
      <section className="bg-white">
        <div className="w-full flex justify-center pt-12 pb-4">
          <div className="max-w-3xl w-full px-6">
            <div className="mb-8 text-center">
              <h2 className="text-[38px] md:text-[50px] lg:text-[62px] text-slate-900 mb-6">
                Real-time
                <br />
                smart data
            </h2>
            </div>
          </div>
        </div>
        <FactsSection />
      </section>

      {/* FAQ Section */}
      <section className="bg-white relative">
        <FAQSection />
        {/* Gradient overlay from footer to FAQ section */}
        <div 
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: "400px",
            background: "linear-gradient(to top, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.04) 30%, rgba(59, 130, 246, 0.02) 60%, transparent 100%)",
            transform: "translateY(100%)",
          }}
        />
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-4 relative overflow-hidden">
        {/* Gradient background that fades seamlessly into the page */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.08) 20%, rgba(59, 130, 246, 0.04) 50%, transparent 100%)",
          }}
        />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4" style={{ gap: '2px' }}>
                <div className="w-12 h-12 flex items-center justify-center">
                  <Logo />
                </div>
                <span className="tracking-tight text-slate-900">Smart Realtor Tools</span>
              </div>
              <p className="text-sm text-slate-600">
                AI-powered analytics for real estate professionals
              </p>
            </div>
            <div>
              <div className="mb-3 text-slate-900">Product</div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="hover:text-slate-900 cursor-pointer transition-colors">Features</div>
                <div className="hover:text-slate-900 cursor-pointer transition-colors">Pricing</div>
                <div className="hover:text-slate-900 cursor-pointer transition-colors">Demo</div>
              </div>
            </div>
            <div>
              <div className="mb-3 text-slate-900">Company</div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="hover:text-slate-900 cursor-pointer transition-colors">About</div>
                <div className="hover:text-slate-900 cursor-pointer transition-colors">Contact</div>
                <div className="hover:text-slate-900 cursor-pointer transition-colors">Support</div>
              </div>
            </div>
            <div>
              <div className="mb-3 text-slate-900">Legal</div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="hover:text-slate-900 cursor-pointer transition-colors">Privacy</div>
                <div className="hover:text-slate-900 cursor-pointer transition-colors">Terms</div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 mt-8 pt-8 text-center text-sm text-slate-500">
            © 2024 Smart Realtor Tools. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}