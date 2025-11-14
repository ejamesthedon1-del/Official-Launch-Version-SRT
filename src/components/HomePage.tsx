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
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { DashboardMockup } from "./DashboardMockup";
import { DashboardPreview } from "./DashboardPreview";
import { Logo } from "./figma/Logo";
import { SlidingInfoSection } from "./SlidingInfoSection";
import { CircularProgress } from "./CircularProgress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Desktop Browser Address Input Component for Step 1
function DesktopBrowserAddressInput() {
  return (
    <div className="bg-slate-100 rounded-3xl p-6 mb-6 shadow-xl overflow-hidden aspect-square flex items-center justify-center relative">
      {/* Smooth AI-like fade effect around edges */}
      <div className="absolute inset-0 pointer-events-none z-10" style={{
        background: 'radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(148, 163, 184, 0.1) 60%, rgba(148, 163, 184, 0.2) 80%, rgba(148, 163, 184, 0.3) 100%)',
        maskImage: 'radial-gradient(circle at center, black 0%, black 40%, transparent 70%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 0%, black 40%, transparent 70%, transparent 100%)',
      }} />
      
      {/* Desktop Browser Mockup */}
      <div className="w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden relative z-0" style={{
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Browser Chrome */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-slate-500 border border-slate-200">
            smartrealtortools.com/analyze
          </div>
        </div>
        
        {/* Browser Content */}
        <div className="p-8 h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
          <div className="w-full max-w-lg">
            {/* Wide Address Input Bar */}
            <div className="relative">
              <div className="bg-white rounded-lg border-2 border-slate-200 shadow-sm p-4 flex items-center gap-3" style={{
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}>
                <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Enter property address..."
                  className="flex-1 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  readOnly
                />
              </div>
              
              {/* Mouse Cursor Icon */}
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 z-20">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                  }}
                >
                  <path
                    d="M1 1 L1 16 L8 16 L12 22 L14 20 L10 15 L20 15 L20 1 Z"
                    fill="#000000"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Desktop Dashboard Score Component for Step 2
function DesktopDashboardScore() {
  return (
    <div className="bg-slate-100 rounded-3xl p-6 mb-6 shadow-xl overflow-hidden aspect-square flex items-center justify-center relative">
      {/* Smooth AI-like fade effect around edges */}
      <div className="absolute inset-0 pointer-events-none z-10" style={{
        background: 'radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(148, 163, 184, 0.1) 60%, rgba(148, 163, 184, 0.2) 80%, rgba(148, 163, 184, 0.3) 100%)',
        maskImage: 'radial-gradient(circle at center, black 0%, black 40%, transparent 70%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 0%, black 40%, transparent 70%, transparent 100%)',
      }} />
      
      {/* Desktop Dashboard Mockup - Cropped to show only score */}
      <div className="w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden relative z-0" style={{
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Browser Chrome */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-slate-500 border border-slate-200">
            smartrealtortools.com/dashboard
          </div>
        </div>
        
        {/* Dashboard Content - Cropped to show only score section */}
        <div className="p-8 h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
          {/* Score Display - Centered and focused */}
          <div className="text-center">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Listing Score</h3>
              <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
                Analyzed
              </Badge>
            </div>
            
            {/* Large Circular Progress Score */}
            <div className="relative inline-block mb-4">
              <CircularProgress 
                percentage={85} 
                size={140} 
                strokeWidth={10}
                showAnimation={false}
              />
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className="text-5xl font-semibold text-blue-600">85</div>
                <div className="text-sm text-slate-500 mt-1">out of 100</div>
              </div>
            </div>
            
            {/* Score Breakdown */}
            <div className="space-y-2.5 mt-6">
              <div className="flex items-center justify-between text-sm min-w-[200px]">
                <span className="text-slate-600">Photos</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full w-[90%] bg-green-500 rounded-full" />
                  </div>
                  <span className="text-slate-900 w-8 text-right">90</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Description</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full w-[75%] bg-yellow-500 rounded-full" />
                  </div>
                  <span className="text-slate-900 w-8 text-right">75</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Pricing</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full w-[90%] bg-green-500 rounded-full" />
                  </div>
                  <span className="text-slate-900 w-8 text-right">90</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fade edges to show cropping effect */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, transparent 10%, transparent 90%, rgba(255,255,255,0.95) 100%)',
          }} />
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to left, rgba(255,255,255,0.95) 0%, transparent 10%, transparent 90%, rgba(255,255,255,0.95) 100%)',
          }} />
        </div>
      </div>
    </div>
  );
}

// PDF Marketing Plan Component for Step 3
function PDFMarketingPlan() {
  return (
    <div className="bg-slate-100 rounded-3xl p-6 mb-6 shadow-xl overflow-hidden aspect-square flex items-center justify-center relative">
      {/* Smooth AI-like fade effect around edges */}
      <div className="absolute inset-0 pointer-events-none z-10" style={{
        background: 'radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(148, 163, 184, 0.1) 60%, rgba(148, 163, 184, 0.2) 80%, rgba(148, 163, 184, 0.3) 100%)',
        maskImage: 'radial-gradient(circle at center, black 0%, black 40%, transparent 70%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 0%, black 40%, transparent 70%, transparent 100%)',
      }} />
      
      {/* Desktop PDF Viewer Mockup */}
      <div className="w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden relative z-0" style={{
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Browser Chrome */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-slate-500 border border-slate-200">
            Marketing Plan - 3404 American Dr.pdf
          </div>
        </div>
        
        {/* PDF Viewer Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border border-slate-300 bg-white flex items-center justify-center">
              <span className="text-xs text-slate-600">-</span>
            </div>
            <div className="w-6 h-6 rounded border border-slate-300 bg-white flex items-center justify-center">
              <span className="text-xs text-slate-600">+</span>
            </div>
            <div className="text-xs text-slate-600 px-2">100%</div>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-600">Page 1 of 1</span>
          </div>
        </div>
        
        {/* PDF Document Content */}
        <div className="p-6 h-full overflow-auto bg-slate-100 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full relative" style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }}>
            {/* PDF Header */}
            <div className="border-b border-slate-200 pb-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-900">AI Marketing Plan</h3>
              </div>
              <p className="text-sm text-slate-600">3404 American Dr, Lago Vista, TX</p>
            </div>
            
            {/* PDF Content */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Week 1: Launch Strategy</h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Professional photography optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Social media campaign launch</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Open house planning and promotion</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Week 2: Engagement</h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Targeted email outreach</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Digital advertising campaign</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Page Edge Shadow */}
            <div className="absolute -right-1 top-0 bottom-0 w-1 bg-gradient-to-r from-transparent to-slate-200/50 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Animated Address Input Component for Step 1 (old - keeping for reference)
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

  const exampleAddress = "3404 American Dr";
  const suggestions = [
    {
      main: "3404 American Dr APT 1105",
      secondary: "Lago Vista, TX 78645"
    },
    {
      main: "3404 American Drive",
      secondary: "Austin, TX"
    },
    {
      main: "3404 American Blvd",
      secondary: "Lago Vista, TX"
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
      <div className="bg-white rounded-3xl p-4 mb-6 shadow-xl overflow-hidden aspect-square flex items-center justify-center relative">
        {/* Shadow fade effect on top */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/5 via-black/2 to-transparent pointer-events-none z-10 rounded-t-3xl" />
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
                transition: "left 0.03s linear, top 0.03s linear, opacity 0.2s ease-out",
                opacity: isTyping || typedText ? 0 : 1,
              }}
            >
              <div className="relative">
                {/* Standard mouse pointer cursor - accurate arrow shape */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  style={{
                    transform: isClicked ? "scale(0.9)" : "scale(1)",
                    transition: "transform 0.1s ease-out",
                    filter: "drop-shadow(0.5px 0.5px 1px rgba(0,0,0,0.5))",
                  }}
                >
                  {/* White outline layer for contrast */}
                  <path
                    d="M0.5 0.5 L0.5 14.5 L7 14.5 L10.5 19 L12 17.5 L9 14 L17.5 14 L17.5 0.5 Z"
                    fill="#ffffff"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeLinejoin="miter"
                  />
                  {/* Black pointer - classic cursor arrow */}
                  <path
                    d="M1 1 L1 14 L7.5 14 L11 18.5 L12.5 17 L9.5 13.5 L18 13.5 L18 1 Z"
                    fill="#000000"
                  />
                </svg>
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

interface HomePageProps {
  onGetStarted: () => void;
  onNavigate: (
    view: "home" | "address-input" | "dashboard" | "marketing-plan"
  ) => void;
  onMenuClick?: () => void;
}

export function HomePage({
  onGetStarted,
  onNavigate,
  onMenuClick,
}: HomePageProps) {
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
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 overflow-hidden">
        {/* Navigation */}
        <div className="relative z-10">
          <div className="container mx-auto max-w-6xl px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <div className="w-12 h-12 flex items-center justify-center">
                  <Logo />
                </div>
                <span className="tracking-tight">Smart Realtor Tool</span>
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
                <button 
                  onClick={() => onNavigate("marketing-plan")}
                  className="hover:text-white transition-colors"
                >
                  Marketing Plan
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
          <h1 className="text-5xl md:text-6xl lg:text-7xl text-white mb-6">
          Every Listing Optimized
            <br />
          in Minutes.
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
    
          Optimize every listing and
          <br />
          sell faster with confidence.
          </p>
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-white text-blue-600 hover:bg-slate-50 shadow-xl gap-2"
          >
            Get Free Listing Analysis<ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Dashboard Preview */}
        <div className="container mx-auto max-w-6xl px-4 relative z-10 pb-4 md:pb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent blur-2xl" />
            <div className="relative transition-transform duration-500 hover:scale-[1.02] overflow-hidden opacity-90" style={{
              maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)'
            }}>
              <DashboardMockup />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl" />
        
        {/* Seamless fade to white transition */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-b from-blue-400/20 via-blue-100/40 via-white/70 to-white pointer-events-none" />
      </section>

      {/* Sliding Info Section */}
      <SlidingInfoSection />

      {/* Sell Faster in 3 Steps */}
      <section className="min-h-screen bg-white pt-12 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-slate-900 mb-6">
              Sell Faster in 3 Steps
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
              <DesktopBrowserAddressInput />
              {/* Arrow to next step - hidden on mobile */}
              <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 z-10">
                <ArrowRight className="w-12 h-12 text-slate-400" />
              </div>
              {/* Step label */}
              <div className="text-left mt-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-xl md:text-2xl text-slate-900">1</div>
                  <h3 className="text-2xl md:text-3xl font-medium text-slate-900">Analyze Listing</h3>
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
              <DesktopDashboardScore />
              {/* Arrow to next step - hidden on mobile */}
              <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 z-10">
                <ArrowRight className="w-12 h-12 text-slate-400" />
              </div>
              {/* Step label */}
              <div className="text-left mt-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-xl md:text-2xl text-slate-900">2</div>
                  <h3 className="text-2xl md:text-3xl font-medium text-slate-900">Get Your Listing Score</h3>
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
              <PDFMarketingPlan />
              {/* Step label */}
              <div className="text-left mt-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-xl md:text-2xl text-slate-900">3</div>
                  <h3 className="text-2xl md:text-3xl font-medium text-slate-900">Get Your Tailored Marketing Plan</h3>
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

      {/* Compare and Contrast */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-slate-900 mb-4">
              AI Intelligence.
              <br />
              Tailored to your listings.
            </h2>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-12 text-center bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 border-0 shadow-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-white mb-4">Ready to Sell Your Listings Faster?</h2>
            <p className="text-xl text-white/90 mb-8">
              Join hundreds of realtors using AI to optimize their listings and
              close deals faster.
            </p>
            <Button size="lg" onClick={onGetStarted} className="gap-2 bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-white/90">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" />
                <span>Free analysis</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  <Logo />
                </div>
                <span className="tracking-tight text-slate-900">Smart Realtor Tool</span>
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
            © 2024 Smart Realtor Tool. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}