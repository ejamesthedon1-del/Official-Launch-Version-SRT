import { useState, useEffect, useRef } from "react";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Navigation } from "./Navigation";
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

export function AddressInput({ onAnalyze, onNavigate, onMenuClick }: AddressInputProps) {
  const [address, setAddress] = useState("");
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
          body: { address },
        }
      );

      if (error) {
        console.error("Analysis error:", error);
        throw error;
      }

      setTimeout(() => {
        setAnalyzing(false);
        onAnalyze(address, analysisData);
      }, 500);
    } catch (err) {
      console.error("Error analyzing listing:", err);
      toast.error("Failed to analyze listing. Please try again.");
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation
        currentView="address-input"
        onNavigate={onNavigate}
        showAnalyze={false}
        onMenuClick={onMenuClick}
      />

      <main className="container mx-auto px-4 pt-24 pb-12">
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
                    onChange={(e) => setAddress(e.target.value)}
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
    </div>
  );
}
