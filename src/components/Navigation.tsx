import { Logo } from "./figma/Logo";

interface NavigationProps {
  currentView: "home" | "address-input" | "dashboard" | "marketing-plan";
  onNavigate: (
    view: "home" | "address-input" | "dashboard" | "marketing-plan"
  ) => void;
  showAnalyze?: boolean;
  onMenuClick?: () => void;
}

export function Navigation({
  currentView,
  onNavigate,
  showAnalyze = true,
  onMenuClick,
}: NavigationProps) {
  const isHomePage = currentView === "home";
  
  return (
    <header 
      className={`md:fixed top-0 left-0 right-0 z-40 shadow-none border-none ${
        isHomePage 
          ? "bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400" 
          : "bg-white"
      }`}
      style={{ 
        boxShadow: 'none', 
        border: 'none', 
        WebkitBoxShadow: 'none',
        MozBoxShadow: 'none',
        msBoxShadow: 'none'
      }}
    >
      <div 
        className="container mx-auto max-w-6xl px-4 py-4" 
        style={{ 
          boxShadow: 'none', 
          WebkitBoxShadow: 'none',
          MozBoxShadow: 'none',
          msBoxShadow: 'none'
        }}
      >
        <div className="flex items-center justify-between">
          {/* Logo - clickable to go home */}
          <button
            onClick={() => onNavigate("home")}
            className={`flex items-center gap-2 hover:opacity-90 transition-opacity ${
              isHomePage ? "text-white" : "text-slate-900"
            }`}
            style={{ boxShadow: 'none', WebkitBoxShadow: 'none' }}
          >
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center p-1.5"
              style={{ boxShadow: 'none', WebkitBoxShadow: 'none', background: 'transparent' }}
            >
              <Logo gradient={isHomePage ? "logoHeaderWhite" : "logoHeader"} />
            </div>
            <span className="tracking-tight font-medium">Smart Realtor Tool</span>
          </button>

          {/* Desktop Navigation - hidden on mobile */}
          <nav className={`hidden md:flex items-center gap-6 text-sm ${
            isHomePage ? "text-white/90" : "text-slate-600"
          }`}>
            <button 
              onClick={() => onNavigate("home")}
              className={`hover:opacity-80 transition-colors ${
                currentView === "home" 
                  ? (isHomePage ? "text-white font-medium" : "text-blue-600 font-medium")
                  : ""
              }`}
            >
              Home
            </button>

            {showAnalyze && (
              <button
                onClick={() => onNavigate("address-input")}
                className={`hover:opacity-80 transition-colors ${
                  currentView === "address-input" 
                    ? "text-blue-600 font-medium" 
                    : ""
                }`}
              >
                Analyze Listing
              </button>
            )}

            <button
              onClick={() => onNavigate("dashboard")}
              className={`hover:opacity-80 transition-colors ${
                currentView === "dashboard" 
                  ? "text-blue-600 font-medium" 
                  : ""
              }`}
            >
              Dashboard
            </button>

            <button className="hover:opacity-80 transition-colors">
              Pricing
            </button>
            <button className="hover:opacity-80 transition-colors">
              Features
            </button>
          </nav>

          {/* Mobile Hamburger Menu Button - 2 bars */}
          <button
            onClick={onMenuClick}
            className={`md:hidden flex flex-col gap-1.5 p-3 rounded-lg transition-colors cursor-pointer ${
              isHomePage 
                ? "hover:bg-white/20" 
                : "hover:bg-slate-100"
            }`}
            aria-label="Menu"
            type="button"
          >
            <span className={`w-6 h-0.5 rounded-full ${
              isHomePage ? "bg-white" : "bg-slate-900"
            }`} />
            <span className={`w-6 h-0.5 rounded-full ${
              isHomePage ? "bg-white" : "bg-slate-900"
            }`} />
          </button>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          header {
            box-shadow: none !important;
            -webkit-box-shadow: none !important;
            -moz-box-shadow: none !important;
            border: none !important;
          }
          header * {
            box-shadow: none !important;
            -webkit-box-shadow: none !important;
            -moz-box-shadow: none !important;
          }
        }
      `}</style>
    </header>
  );
}