export default function CursorIcon({ 
  className = "", 
  color = "#000000",
  width = 24,
  height = 24 
}: { 
  className?: string
  color?: string
  width?: number
  height?: number
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
        fill={color}
        stroke={color}
        strokeWidth="0.5"
        strokeLinejoin="miter"
      />
    </svg>
  )
}

// Export as pure SVG string for use in other contexts
export const CursorSVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="0.5"
    strokeLinejoin="miter"
  />
</svg>`

