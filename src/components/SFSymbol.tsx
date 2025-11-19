import React from "react";

interface SFSymbolProps {
  name: string;
  size?: number;
  weight?: "ultralight" | "thin" | "light" | "regular" | "medium" | "semibold" | "bold" | "heavy" | "black";
  color?: string;
  className?: string;
}

// SF Symbols Unicode mappings (using SF Symbols font on Apple devices)
// These will render as SF Symbols on Apple devices via system fonts
const SF_SYMBOLS_MAP: Record<string, string> = {
  // Dashboard icons
  "chart.line.uptrend.xyaxis": "\u{1F4C8}", // 📈 fallback, but will use SF Symbol on Apple
  "eye": "\u{1F441}", // 👁
  "dollarsign.circle": "\u{0024}", // $ 
  "mappin": "\u{1F4CD}", // 📍
  "bed.double": "\u{1F6CF}", // 🛏
  "drop": "\u{1F4A7}", // 💧
  "square": "\u{25A1}", // □
  "calendar": "\u{1F4C5}", // 📅
  "exclamationmark.triangle": "\u{26A0}", // ⚠
  "checkmark.circle": "\u{2713}", // ✓
  "exclamationmark.circle": "\u{26A0}", // ⚠
  "chevron.right": "\u{203A}", // ›
  "chevron.down": "\u{2304}", // ⌄
  "chevron.up": "\u{2303}", // ⌃
  "sparkles": "\u{2728}", // ✨
  "ruler": "\u{1F4CF}", // 📏
  "bell": "\u{1F514}", // 🔔
  "gearshape": "\u{2699}", // ⚙
  "chart.line.downtrend.xyaxis": "\u{1F4C9}", // 📉
  "bolt": "\u{26A1}", // ⚡
  "person.2": "\u{1F465}", // 👥
  "target": "\u{1F3AF}", // 🎯
  "lock": "\u{1F512}", // 🔒
};

export function SFSymbol({ 
  name, 
  size = 16, 
  weight = "regular",
  color,
  className = "" 
}: SFSymbolProps) {
  const symbol = SF_SYMBOLS_MAP[name] || "•";
  
  const weightMap: Record<string, number> = {
    "ultralight": 100,
    "thin": 200,
    "light": 300,
    "regular": 400,
    "medium": 500,
    "semibold": 600,
    "bold": 700,
    "heavy": 800,
    "black": 900,
  };
  
  return (
    <span
      className={className}
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Symbols', 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif",
        fontSize: `${size}px`,
        fontWeight: weightMap[weight] || 400,
        color: color || "currentColor",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1,
        fontFeatureSettings: '"liga" 1, "calt" 1',
      }}
    >
      {symbol}
    </span>
  );
}

