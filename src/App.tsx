import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { HomePage } from "./components/HomePage";
import { AddressInput } from "./components/AddressInput";
import { Dashboard } from "./components/Dashboard";
import { SubscriptionPage } from "./components/SubscriptionPage";
import { MobileMenu } from "./components/MobileMenu";
import { Toaster } from "./components/ui/sonner";

type View = "home" | "address-input" | "dashboard" | "subscription";

export interface AnalysisData {
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

export default function App() {
  // Load saved state from localStorage on mount with error handling
  const [currentView, setCurrentView] = useState<View>(() => {
    try {
      const saved = localStorage.getItem("currentView");
      return (saved as View) || "home";
    } catch (error) {
      console.error("Error reading currentView from localStorage:", error);
      return "home";
    }
  });
  const [enteredAddress, setEnteredAddress] = useState(() => {
    try {
      return localStorage.getItem("enteredAddress") || "";
    } catch (error) {
      console.error("Error reading enteredAddress from localStorage:", error);
      return "";
    }
  });
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(() => {
    try {
      const saved = localStorage.getItem("analysisData");
      if (!saved) return null;
      return JSON.parse(saved);
    } catch (error) {
      console.error("Error reading analysisData from localStorage:", error);
      // Clear corrupted data
      try {
        localStorage.removeItem("analysisData");
      } catch (e) {
        // Ignore cleanup errors
      }
      return null;
    }
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Save state to localStorage whenever it changes with error handling
  useEffect(() => {
    try {
      localStorage.setItem("currentView", currentView);
    } catch (error) {
      console.error("Error saving currentView to localStorage:", error);
    }
  }, [currentView]);

  useEffect(() => {
    try {
      if (enteredAddress) {
        localStorage.setItem("enteredAddress", enteredAddress);
      }
    } catch (error) {
      console.error("Error saving enteredAddress to localStorage:", error);
    }
  }, [enteredAddress]);

  useEffect(() => {
    try {
      if (analysisData) {
        localStorage.setItem("analysisData", JSON.stringify(analysisData));
      }
    } catch (error) {
      console.error("Error saving analysisData to localStorage:", error);
    }
  }, [analysisData]);

  const handleGetStarted = () => {
    setCurrentView("address-input");
  };

  const handleAnalyze = (address: string, data: AnalysisData) => {
    setEnteredAddress(address);
    setAnalysisData(data);
    setCurrentView("dashboard");
  };

  const handleSubscribe = () => {
    setCurrentView("subscription");
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    // Keep saved data in localStorage so users can return to their previous analysis
  };

  const handleMenuClick = () => {
    console.log("🍔 App: Menu clicked, opening mobile menu");
    setIsMobileMenuOpen(true);
  };

  const handleMenuClose = () => {
    console.log("🍔 App: Closing mobile menu");
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {currentView === "home" && (
        <HomePage 
          onGetStarted={handleGetStarted} 
          onNavigate={handleNavigate}
          onMenuClick={handleMenuClick}
        />
      )}
      {currentView === "address-input" && (
        <AddressInput 
          onAnalyze={handleAnalyze} 
          onNavigate={handleNavigate}
          onMenuClick={handleMenuClick}
        />
      )}
      {currentView === "dashboard" && (
        <Dashboard
          onSubscribe={handleSubscribe}
          onNavigate={handleNavigate}
          address={enteredAddress}
          analysisData={analysisData}
          onMenuClick={handleMenuClick}
        />
      )}
      {currentView === "subscription" && (
        <SubscriptionPage
          onNavigate={handleNavigate}
          onSubscribe={() => setCurrentView("dashboard")}
          address={enteredAddress}
        />
      )}
      
      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={handleMenuClose}
        currentView={currentView}
        onNavigate={handleNavigate}
      />
      
      <Toaster />
      <Analytics />
    </>
  );
}
