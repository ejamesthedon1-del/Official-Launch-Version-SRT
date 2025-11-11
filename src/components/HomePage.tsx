import {
  ArrowRight,
  CheckCircle,
  Star,
  Home,
  BarChart3,
  FileText,
  MapPin,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { DashboardMockup } from "./DashboardMockup";
import { DashboardPreview } from "./DashboardPreview";
import { Logo } from "./figma/Logo";
import { SlidingInfoSection } from "./SlidingInfoSection";

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
                <button className="hover:text-white transition-colors">
                  Pricing
                </button>
                <button className="hover:text-white transition-colors">
                  Features
                </button>
                <button className="hover:text-white transition-colors">
                  Blog
                </button>
              </div>

              {/* Mobile Hamburger Menu */}
              <button
                onClick={() => {
                  console.log("🍔 Hamburger clicked!");
                  console.log("🍔 onMenuClick exists?", !!onMenuClick);
                  if (onMenuClick) {
                    console.log("🍔 Calling onMenuClick now...");
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
        <div className="container mx-auto max-w-4xl px-4 pt-12 pb-32 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl text-white mb-6">
          Smart Agents
            <br />
           Close Faster. 
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Advanced AI Marketing Intelligence.
          <br />
          Instantly turn listings into closings.
          </p>
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-white text-blue-600 hover:bg-slate-50 shadow-xl gap-2"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Dashboard Preview */}
        <div className="container mx-auto max-w-6xl px-4 relative z-10 pb-8 md:pb-20">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent blur-2xl" />
            <div className="relative transition-transform duration-500 hover:scale-[1.02] overflow-hidden">
              <DashboardMockup />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl" />
      </section>

      {/* Sliding Info Section */}
      <SlidingInfoSection />

      {/* Sell Faster in 3 Steps */}
      <section className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
              Simple Process
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Sell Faster in 3 Steps
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              The fastest way to sell your listings
            </p>
          </div>

          {/* Steps */}
          <div className="grid lg:grid-cols-3 gap-12 items-start mb-16">
            {/* Step 1: Analyze Listing */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-3xl p-4 mb-6 shadow-xl overflow-hidden aspect-square flex items-center justify-center">
                {/* Address Input mockup */}
                <div className="w-full h-full">
                  {/* Browser chrome */}
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
                    {/* Address Input content */}
                    <div className="flex-1 overflow-hidden relative bg-white p-4 md:p-6">
                      <div className="h-full flex flex-col items-center justify-center">
                        {/* Header */}
                        <div className="text-center mb-6">
                          <Badge className="mb-3 text-xs">Step 1 of 2</Badge>
                          <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">Enter Your Property Address</h2>
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
                                <input
                                  type="text"
                                  placeholder="123 Main Street, City, State ZIP"
                                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  readOnly
                                />
                                
                                {/* Mouse cursor hovering over "Street" word */}
                                <div className="absolute top-1/2 left-[45%] -translate-y-1/2 z-20">
                                  <div className="relative">
                                    <svg width="24" height="24" viewBox="0 0 24 24" className="text-blue-600 drop-shadow-lg">
                                      <path
                                        fill="currentColor"
                                        d="M8 2l12 11-5.5-.5L12 18z"
                                      />
                                    </svg>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-600 rounded-full animate-ping opacity-75" />
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-slate-500">
                                Start typing to see address suggestions
                              </p>
                            </div>
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
              <div className="text-center">
                <div className="text-slate-500 mb-2">1</div>
                <h3 className="text-slate-900 mb-2">Analyze Listing</h3>
                <p className="text-sm text-slate-600">
                  Simply enter your property address to get started
                </p>
              </div>
            </div>

            {/* Step 2: Get Listing Score */}
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-3xl p-8 mb-6 shadow-xl overflow-hidden aspect-square flex items-center justify-center">
                {/* Score card mockup */}
                <div className="w-full max-w-[280px]">
                  <div className="bg-white rounded-2xl shadow-2xl p-6">
                    {/* Header with badge */}
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-slate-900">Listing Score</h4>
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        Analyzed
                      </Badge>
                    </div>
                    {/* Large score display */}
                    <div className="text-center mb-6">
                      <div className="relative inline-block w-32 h-32">
                        {/* Circular progress background */}
                        <svg className="w-32 h-32 -rotate-90 absolute inset-0">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="#e2e8f0"
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="#3b82f6"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray="352"
                            strokeDashoffset="88"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <div className="text-blue-600" style={{ fontSize: '2rem' }}>85</div>
                          <div className="text-xs text-slate-500">out of 100</div>
                        </div>
                      </div>
                    </div>
                    {/* Score breakdown */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Photos</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full w-4/5 bg-green-500 rounded-full" />
                          </div>
                          <span className="text-slate-900 w-6">90</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Description</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full w-3/5 bg-yellow-500 rounded-full" />
                          </div>
                          <span className="text-slate-900 w-6">75</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Pricing</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full w-[90%] bg-green-500 rounded-full" />
                          </div>
                          <span className="text-slate-900 w-6">90</span>
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
              <div className="text-center">
                <div className="text-slate-500 mb-2">2</div>
                <h3 className="text-slate-900 mb-2">Get Your Listing Score</h3>
                <p className="text-sm text-slate-600">
                  Analyze your listing's strengths and weaknesses
                </p>
              </div>
            </div>

            {/* Step 3: Get Marketing Plan */}
            <div className="relative">
              <div className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-3xl p-8 mb-6 shadow-xl overflow-hidden aspect-square flex items-center justify-center">
                {/* Marketing plan document mockup */}
                <div className="w-full max-w-[280px]">
                  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Document header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4" />
                        <div className="text-xs opacity-90">Marketing Plan</div>
                      </div>
                      <div style={{ fontSize: '0.95rem' }}>123 Oak Street</div>
                    </div>
                    {/* Document content */}
                    <div className="p-6">
                      {/* Week 1 section */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                            1
                          </div>
                          <div className="text-sm text-slate-900">Week 1: Launch</div>
                        </div>
                        <div className="space-y-2 ml-8">
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                            <div className="text-xs text-slate-600 leading-relaxed">Professional photos</div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                            <div className="text-xs text-slate-600 leading-relaxed">Social media campaign</div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                            <div className="text-xs text-slate-600 leading-relaxed">Open house planning</div>
                          </div>
                        </div>
                      </div>
                      {/* Week 2 section */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                            2
                          </div>
                          <div className="text-sm text-slate-900">Week 2: Engage</div>
                        </div>
                        <div className="space-y-2 ml-8">
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                            <div className="text-xs text-slate-600 leading-relaxed">Email outreach</div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                            <div className="text-xs text-slate-600 leading-relaxed">Targeted ads</div>
                          </div>
                        </div>
                      </div>
                      {/* CTA badge */}
                      <div className="mt-6 pt-4 border-t border-slate-200">
                        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs">
                          <BarChart3 className="w-3 h-3" />
                          <span>Track Progress</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Step label */}
              <div className="text-center">
                <div className="text-slate-500 mb-2">3</div>
                <h3 className="text-slate-900 mb-2">Get Your Tailored Marketing Plan</h3>
                <p className="text-sm text-slate-600">
                  Receive a week-by-week action plan to sell faster
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
              Trusted by Realtors
            </Badge>
            <h2 className="mb-4 text-slate-900">What Real Estate Professionals Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-blue-600 text-blue-600"
                    />
                  ))}
                </div>
                <p className="text-sm mb-4 text-slate-700">"{testimonial.content}"</p>
                <div>
                  <div className="text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">
                    {testimonial.role}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-12 text-center bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 border-0 shadow-2xl">
            <h2 className="mb-4 text-white">Ready to Sell Your Listings Faster?</h2>
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