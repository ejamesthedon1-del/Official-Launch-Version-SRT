import { useState, useEffect, useRef } from "react";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { toast } from "sonner";
import { supabase } from "../lib/supabaseClient";

interface AddressInputProps {
  onAnalyze: (address: string, analysisData: any) => void;
  onNavigate: (
    view: "home" | "address-input" | "dashboard" | "marketing-plan"
  ) => void;
  onMenuClick?: () => void;
}

interface Prediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

// Transform Gemini AI response to Dashboard's expected format
function transformAnalysisData(address: string, geminiData: any): any {
  // If it already has the correct structure, return it
  if (geminiData.listing && geminiData.overallScore) {
    // Preserve propertyImageUrl if it exists
    if (geminiData.propertyImageUrl) {
      geminiData.listing.imageUrl = geminiData.propertyImageUrl;
    }
    return geminiData;
  }

  // Extract city from address (simple parsing)
  const addressParts = address.split(",");
  const city = addressParts.length > 1 ? addressParts[addressParts.length - 2]?.trim() || "Unknown" : "Unknown";

  // Transform the simple Gemini response to the full Dashboard structure
  // Prefer estimatedPrice (actual listing price) over estimatedValue
  const estimatedValue = geminiData.estimatedPrice || geminiData.estimatedValue || 0;
  
  // Parse and validate numeric fields with fallbacks
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
      imageUrl: geminiData.propertyImageUrl || null // Add image URL if available
    },
    overallScore: 75, // Default score
    ratings: [
      {
        title: "Property Type",
        score: 8,
        maxScore: 10,
        category: "Type",
        description: geminiData.propertyType || "Residential property"
      },
      {
        title: "Market Trend",
        score: 7,
        maxScore: 10,
        category: "Market",
        description: geminiData.marketTrend || "Stable market"
      },
      {
        title: "Key Features",
        score: 8,
        maxScore: 10,
        category: "Features",
        description: geminiData.keyFeatures?.join(", ") || "Standard features"
      }
    ],
    categoryScores: [
      { category: "Property Type", score: 8 },
      { category: "Market Trend", score: 7 },
      { category: "Features", score: 8 }
    ],
    radarData: [
      { subject: "Value", A: 7, fullMark: 10 },
      { subject: "Location", A: 8, fullMark: 10 },
      { subject: "Features", A: 8, fullMark: 10 },
      { subject: "Market", A: 7, fullMark: 10 }
    ],
    insights: {
      summary: `Analysis for ${address}. ${geminiData.marketTrend || "Market conditions are stable"}. ${geminiData.keyFeatures?.join(", ") || "Standard property features"}.`,
      alerts: geminiData.riskFactors?.map((risk: string) => ({
        type: "warning",
        title: "Risk Factor",
        message: risk
      })) || [],
      topPriorities: geminiData.recommendations || ["Review property details", "Check market conditions"]
    }
  };
}

export function AddressInput({ onAnalyze, onNavigate, onMenuClick }: AddressInputProps) {
  const [address, setAddress] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

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
          throw error;
        }

        setPredictions(data?.predictions || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Error fetching autocomplete:", err);
        toast.error("Failed to load address suggestions");
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
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || predictions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < predictions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectPrediction(predictions[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
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
            placeId: selectedPlaceId || undefined // Send place_id if available
          },
        }
      );

      if (error) {
        console.error("Analysis error:", error);
        // Log more details about the error
        if (error.message) {
          console.error("Error message:", error.message);
        }
        if (error.context) {
          console.error("Error context:", error.context);
        }
        
        // Try to get the actual error response from the function
        try {
          const response = error.context as Response;
          if (response) {
            const errorText = await response.text();
            console.error("Edge Function error response:", errorText);
            try {
              const errorJson = JSON.parse(errorText);
              console.error("Edge Function error JSON:", errorJson);
              if (errorJson.error) {
                toast.error(`Analysis failed: ${errorJson.error}`);
              } else if (errorJson.details) {
                toast.error(`Analysis failed: ${JSON.stringify(errorJson.details)}`);
              } else {
                toast.error(`Analysis failed: ${errorText}`);
              }
            } catch {
              toast.error(`Analysis failed: ${errorText || error.message}`);
            }
          }
        } catch (parseErr) {
          console.error("Could not parse error response:", parseErr);
        }
        
        // Check if we got a response with error details
        if (analysisData?.error) {
          console.error("Edge Function error in data:", analysisData.error);
          toast.error(`Analysis failed: ${analysisData.error}`);
        } else if (!error.context) {
          toast.error("Failed to analyze listing. Please check the console for details.");
        }
        setAnalyzing(false);
        return;
      }

      // Check if the response has the expected structure
      console.log("Analysis response received:", analysisData);
      
      if (analysisData?.result) {
        // Transform the Gemini response to match the Dashboard's expected structure
        console.log("Transforming result data:", analysisData.result);
        const transformedData = transformAnalysisData(address, analysisData.result);
        console.log("Transformed data:", transformedData);
        setTimeout(() => {
          setAnalyzing(false);
          onAnalyze(address, transformedData);
        }, 500);
      } else if (analysisData) {
        // If response doesn't have .result, try to transform it
        console.log("Transforming direct data:", analysisData);
        const transformedData = transformAnalysisData(address, analysisData);
        console.log("Transformed data:", transformedData);
        setTimeout(() => {
          setAnalyzing(false);
          onAnalyze(address, transformedData);
        }, 500);
      } else {
        console.error("No analysis data received");
        throw new Error("No data received from analysis");
      }
    } catch (err: any) {
      console.error("Error analyzing listing:", err);
      const errorMessage = err?.message || "Unknown error occurred";
      toast.error(`Failed to analyze listing: ${errorMessage}`);
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation
        currentView="address-input"
        onNavigate={onNavigate}
        onMenuClick={onMenuClick}
      />

      <main className="container mx-auto px-4 pt-4 md:pt-24 pb-32 md:pb-40">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4">Step 1 of 2</Badge>
            <h1 className="mb-4">Enter Your Property Address</h1>
            <p className="text-xl text-muted-foreground">
              Our AI will analyze your listing and provide detailed insights in
              seconds
            </p>
          </div>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address">Property Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground z-10" />
                  <Input
                    ref={inputRef}
                    id="address"
                    type="text"
                    placeholder="123 Main Street, City, State ZIP"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      // Clear place_id when user manually types (not selecting from autocomplete)
                      if (selectedPlaceId) {
                        setSelectedPlaceId(null);
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                      if (predictions.length > 0) setShowSuggestions(true);
                    }}
                    className="pl-10"
                    disabled={analyzing}
                    required
                    autoComplete="off"
                  />

                  {loading && (
                    <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-muted-foreground" />
                  )}

                  {showSuggestions && predictions.length > 0 && (
                    <div
                      ref={suggestionsRef}
                      className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
                    >
                      {predictions.map((prediction, index) => (
                        <button
                          key={prediction.place_id}
                          type="button"
                          onClick={() => handleSelectPrediction(prediction)}
                          className={`w-full text-left px-4 py-3 hover:bg-accent transition-colors flex items-start gap-3 ${
                            selectedIndex === index ? "bg-accent" : ""
                          }`}
                        >
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm">
                              {prediction.structured_formatting.main_text}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {prediction.structured_formatting.secondary_text}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Start typing to see address suggestions
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
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
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}