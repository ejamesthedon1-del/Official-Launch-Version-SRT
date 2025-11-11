// Abstract Door Logo Component for Smart Realtor Tool
export const Logo = ({ className = "w-full h-full", gradient = "logoGradient" }) => (
  <svg viewBox="0 0 200 200" className={className}>
    <defs>
      <linearGradient id={gradient} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="logoHeaderWhite" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#f1f5f9', stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="logoFooter" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#e2e8f0', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect x="75" y="70" width="50" height="70" fill={`url(#${gradient})`} rx="6" />
    <circle cx="110" cy="105" r="5" fill="white" opacity="0.8" />
    <path d="M 70 65 L 100 50 L 130 65" stroke={`url(#${gradient})`} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);