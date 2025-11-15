import { useEffect, useState } from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  showAnimation?: boolean;
}

// Get color based on score percentage
function getScoreColor(percentage: number): string {
  if (percentage >= 80) {
    // Green for high scores (80-100)
    return "#22c55e";
  } else if (percentage >= 60) {
    // Yellow for medium-high scores (60-79)
    return "#eab308";
  } else if (percentage >= 40) {
    // Orange for medium scores (40-59)
    return "#f97316";
  } else {
    // Red for low scores (0-39)
    return "#ef4444";
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
      const increment = percentage / 60;
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
          stroke={getScoreColor(percentage)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
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

