import { useEffect, useState } from 'react';

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  showAnimation?: boolean;
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

  const startAngle = 135;
  const endAngle = startAngle + 270;

  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  const center = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
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
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
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

