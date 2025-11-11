// House Icon Logo Component for Smart Realtor Tool
export const Logo = ({ className = "w-full h-full", gradient = "logoGradient" }) => (
  <svg viewBox="0 0 200 200" className={className}>
    <defs>
      <linearGradient id={gradient} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
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
    {/* V-shaped roof (gable roof) with rounded edges - positioned above door */}
    <path 
      d="M 70 75 Q 70 65 80 65 L 100 50 L 120 65 Q 130 65 130 75 L 130 75" 
      fill={`url(#${gradient})`} 
      stroke="none"
    />
    {/* Rectangular door with softly rounded corners - lower portion */}
    <rect 
      x="75" 
      y="75" 
      width="50" 
      height="70" 
      fill={`url(#${gradient})`} 
      rx="6" 
      ry="6"
    />
    {/* Circular doorknob on the right side - light gray/off-white */}
    <circle 
      cx="115" 
      cy="110" 
      r="3.5" 
      fill="#e5e7eb" 
      opacity="0.95"
    />
  </svg>
);