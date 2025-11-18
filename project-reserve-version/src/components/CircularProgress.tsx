import { useEffect, useState } from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  showAnimation?: boolean;
}

// Get color based on current percentage - transitions through all colors gradually
function getScoreColor(currentPercentage: number): string {
  // Red (0-33%) → Orange (33-66%) → Yellow (66-100%)
  // Red: #ef4444 = rgb(239, 68, 68)
  // Orange: #f97316 = rgb(249, 115, 22)
  // Yellow: #eab308 = rgb(234, 179, 8)
  // Green: #22c55e = rgb(34, 197, 94)
  
  if (currentPercentage <= 33) {
    // Red to Orange transition
    const ratio = currentPercentage / 33;
    const r = 239 + Math.round(10 * ratio);  // 239 → 249
    const g = 68 + Math.round(47 * ratio);   // 68 → 115
    const b = 68 - Math.round(46 * ratio);    // 68 → 22
    return `rgb(${r}, ${g}, ${b})`;
  } else if (currentPercentage <= 66) {
    // Orange to Yellow transition
    const ratio = (currentPercentage - 33) / 33;
    const r = 249 - Math.round(15 * ratio);    // 249 → 234
    const g = 115 + Math.round(64 * ratio);   // 115 → 179
    const b = 22 - Math.round(14 * ratio);    // 22 → 8
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Yellow to Green transition
    const ratio = (currentPercentage - 66) / 34;
    const r = 234 - Math.round(200 * ratio);    // 234 → 34
    const g = 179 + Math.round(18 * ratio);    // 179 → 197
    const b = 8 + Math.round(86 * ratio);      // 8 → 94
    return `rgb(${r}, ${g}, ${b})`;
  }
}

export function CircularProgress({ 
  percentage, 
  size = 200, 
  strokeWidth = 20,
  showAnimation = true 
}: CircularProgressProps) {
  const [displayPercentage, setDisplayPercentage] = useState(0);
  
  useEffect(() => {
    if (showAnimation) {
      let current = 0;
      // Slower animation: 120 frames instead of 60
      const increment = percentage / 120;
      const timer = setInterval(() => {
        current += increment;
        if (current >= percentage) {
          setDisplayPercentage(percentage);
          clearInterval(timer);
        } else {
          setDisplayPercentage(Math.floor(current));
        }
      }, 16);
      return () => clearInterval(timer);
    } else {
      setDisplayPercentage(percentage);
    }
  }, [percentage, showAnimation]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI * 1.5;
  const offset = circumference - (displayPercentage / 100) * circumference;

  // Opening faces downward at bottom (90°)
  // Arc covers 270°: start at 135° (bottom-right), go counterclockwise to 45° (bottom-left)
  // This creates: bottom-right → right → top → left → bottom-left, with opening at bottom
  const startAngle = 135; // Bottom-right
  const endAngle = 45; // Bottom-left (135° + 270° = 405° = 45° after wrapping)

  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  const center = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {/* Background Arc */}
        <path
          d={`
            M ${center + radius * Math.cos(startRad)} ${center + radius * Math.sin(startRad)}
            A ${radius} ${radius} 0 1 1 ${center + radius * Math.cos(endRad)} ${center + radius * Math.sin(endRad)}
          `}
          fill="none"
          stroke="#e0e7ff"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Progress Arc */}
        <path
          d={`
            M ${center + radius * Math.cos(startRad)} ${center + radius * Math.sin(startRad)}
            A ${radius} ${radius} 0 1 1 ${center + radius * Math.cos(endRad)} ${center + radius * Math.sin(endRad)}
          `}
          fill="none"
          stroke={getScoreColor(displayPercentage)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-2000 ease-out"
        />
      </svg>
      
      {/* Percentage Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className="text-slate-900 transition-all duration-300 font-bold"
          style={{ fontSize: size * 0.2 }}
        >
          {displayPercentage}
        </span>
      </div>
    </div>
  );
}

