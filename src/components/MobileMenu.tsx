import React from "react";
import { Home, MapPin, BarChart3, FileText, X } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: "home" | "address-input" | "dashboard" | "marketing-plan";
  onNavigate: (
    view: "home" | "address-input" | "dashboard" | "marketing-plan"
  ) => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  currentView,
  onNavigate,
}: MobileMenuProps) {
  console.log("🎯 MobileMenu render - isOpen:", isOpen);
  
  if (!isOpen) {
    console.log("🎯 Menu is closed, not rendering");
  } else {
    console.log("🎯 Menu is OPEN, rendering now!");
  }

  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "address-input", label: "Analyze Listing", icon: MapPin },
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "marketing-plan", label: "Marketing Plan", icon: FileText },
  ];

  const handleNavigate = (
    view: "home" | "address-input" | "dashboard" | "marketing-plan"
  ) => {
    onNavigate(view);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[9998] md:hidden"
          onClick={onClose}
        />
      )}

      {/* Bottom Sheet Menu */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[9999] md:hidden"
        style={{
          transform: isOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s ease-out",
        }}
      >
        {/* Handle bar at top */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Close button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Menu Content */}
        <nav className="px-6 py-6 pb-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[13px] font-normal">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}