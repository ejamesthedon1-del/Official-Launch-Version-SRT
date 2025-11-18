import { Logo } from "./figma/Logo";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4" style={{ gap: '2px' }}>
              <div className="w-12 h-12 flex items-center justify-center">
                <Logo />
              </div>
              <span className="tracking-tight text-slate-900">Smart Realtor Tools</span>
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
          © 2024 Smart Realtor Tools. All rights reserved.
        </div>
      </div>
    </footer>
  );
}