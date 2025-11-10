import {
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { DashboardMockup } from "./DashboardMockup";
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
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center p-1.5">
                  <Logo gradient="logoHeaderWhite" />
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
          Sell Faster.
            <br />
            Win More Listings.  
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get instant AI-powered analysis of your property listings to sell
            faster, optimize pricing, and create winning marketing strategies.
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
        <div className="container mx-auto max-w-6xl px-4 relative z-10 pb-20">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent blur-2xl" />
            <div className="relative transition-transform duration-500 hover:scale-[1.02]">
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

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
              Simple Process
            </Badge>
            <h2 className="mb-4 text-slate-900">Get Your Analysis in Minutes</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">
                1
              </div>
              <h3 className="mb-2 text-slate-900">Enter Your Address</h3>
              <p className="text-slate-600">
                Input your property address and basic details
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">
                2
              </div>
              <h3 className="mb-2 text-slate-900">AI Analyzes Your Listing</h3>
              <p className="text-slate-600">
                Our AI evaluates 10+ critical factors instantly
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">
                3
              </div>
              <h3 className="mb-2 text-slate-900">Get Your Action Plan</h3>
              <p className="text-slate-600">
                Receive tailored marketing strategy to sell faster
              </p>
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
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center p-1.5">
                  <Logo gradient="logoFooter" />
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