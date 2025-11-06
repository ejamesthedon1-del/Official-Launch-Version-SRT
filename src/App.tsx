import { useState } from "react";
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
  const [currentView, setCurrentView] = useState<View>("home");
  const [enteredAddress, setEnteredAddress] = useState("");
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
