import { useState, useEffect } from "react";
import { HomePage } from "./components/HomePage";
import { AddressInput } from "./components/AddressInput";
import { Dashboard } from "./components/Dashboard";
import { MarketingPlan } from "./components/MarketingPlan";
import { MobileMenu } from "./components/MobileMenu";
import { Toaster } from "./components/ui/sonner";

type View = "home" | "address-input" | "dashboard" | "marketing-plan";

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

export default function App() {
  // Load saved state from localStorage on mount
  const [currentView, setCurrentView] = useState<View>(() => {
    const saved = localStorage.getItem("currentView");
    return (saved as View) || "home";
  });
  const [enteredAddress, setEnteredAddress] = useState(() => {
    return localStorage.getItem("enteredAddress") || "";
  });
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(() => {
    const saved = localStorage.getItem("analysisData");
    return saved ? JSON.parse(saved) : null;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentView", currentView);
  }, [currentView]);

  useEffect(() => {
    if (enteredAddress) {
      localStorage.setItem("enteredAddress", enteredAddress);
    }
  }, [enteredAddress]);

  useEffect(() => {
    if (analysisData) {
      localStorage.setItem("analysisData", JSON.stringify(analysisData));
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
    setCurrentView("marketing-plan");
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    // Clear saved data if navigating away from dashboard
    if (view === "home") {
      localStorage.removeItem("enteredAddress");
      localStorage.removeItem("analysisData");
      setEnteredAddress("");
      setAnalysisData(null);
    }
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
      {currentView === "marketing-plan" && (
        <MarketingPlan onNavigate={handleNavigate} onMenuClick={handleMenuClick} />
      )}
      
      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={handleMenuClose}
        currentView={currentView}
        onNavigate={handleNavigate}
      />
      
      <Toaster />
    </>
  );
}
