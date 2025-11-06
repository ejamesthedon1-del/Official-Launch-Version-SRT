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
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 shadow-lg">
      <div className="container mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - clickable to go home */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
          >
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center p-1.5">
              <Logo gradient="logoHeaderWhite" />
            </div>
            <span className="tracking-tight font-medium">Smart Realtor Tool</span>
          </button>

          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6 text-white/90 text-sm">
            <button 
              onClick={() => onNavigate("home")}
              className={`hover:text-white transition-colors ${currentView === "home" ? "text-white font-medium" : ""}`}
            >
              Home
            </button>

            {showAnalyze && (
              <button
                onClick={() => onNavigate("address-input")}
                className={`hover:text-white transition-colors ${currentView === "address-input" ? "text-white font-medium" : ""}`}
              >
                Analyze Listing
              </button>
            )}

            <button className="hover:text-white transition-colors">
              Pricing
            </button>
            <button className="hover:text-white transition-colors">
              Features
            </button>
          </nav>

          {/* Mobile Hamburger Menu Button - 2 bars */}
          <button
            onClick={onMenuClick}
            className="md:hidden flex flex-col gap-1.5 p-3 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            aria-label="Menu"
            type="button"
          >
            <span className="w-6 h-0.5 bg-white rounded-full" />
            <span className="w-6 h-0.5 bg-white rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}