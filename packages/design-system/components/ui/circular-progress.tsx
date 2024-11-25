"use client"

interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function CircularProgress({
  value,
  size = 60,
  strokeWidth = 6,
  className = "",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  // Determine the emoji based on the value
  const emoji = value >= 90 ? '🤩' :
                 value >= 70 ? '😊' :
                 value >= 50 ? '😐' :
                 '😢';

  return (
    <div className={className}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          className="stroke-muted"
          fill="none"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`transition-all duration-300 ease-in-out ${
            value >= 90 ? 'stroke-green-500' :
            value >= 70 ? 'stroke-blue-500' :
            value >= 50 ? 'stroke-yellow-500' :
            'stroke-red-500'
          }`}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <text
          x="50%"
          y="54%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: size / 1.7 }}
          transform={`rotate(90, ${size / 2}, ${size / 2})`} // Rotate by 90 degrees around the center
        >
          {emoji}
        </text>
      </svg>
    </div>
  )
}