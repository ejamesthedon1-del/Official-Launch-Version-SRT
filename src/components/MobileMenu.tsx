import React, { useEffect } from "react";
import { X } from "lucide-react";

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
    { id: "home", label: "Home" },
    { id: "address-input", label: "Analyze listing" },
    { id: "dashboard", label: "Dashboard" },
    { id: "marketing-plan", label: "Marketing plan" },
  ];

  const handleNavigate = (
    view: "home" | "address-input" | "dashboard" | "marketing-plan"
  ) => {
    onNavigate(view);
    onClose();
  };

  // Disable page scrolling when menu is open, re-enable when closed
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Disable body scroll
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable body scroll
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[9999] md:hidden flex flex-col"
        style={{
          transform: isOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s ease-out",
          height: "80vh",
          maxHeight: "80vh",
        }}
      >
        {/* Handle bar at top */}
        <div className="flex justify-center pt-4 pb-2 flex-shrink-0">
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
        <nav className="px-6 py-6 pb-8 flex-1 flex flex-col justify-center overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id as any)}
                className={`w-full flex items-center px-4 py-4 transition-colors ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                <span className="text-[13px] font-bold">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}