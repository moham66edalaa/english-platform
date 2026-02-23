// 📁 components/dashboard/ProgressRing.tsx

interface Props { percent: number; size?: number }

export default function ProgressRing({ percent, size = 56 }: Props) {
  const r        = (size - 8) / 2
  const circ     = 2 * Math.PI * r
  const offset   = circ - (percent / 100) * circ

  return (
    <svg width={size} height={size} className="flex-shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(245,240,232,0.08)" strokeWidth={4} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="#c9a84c" strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
            className="rotate-90" transform={`rotate(90, ${size / 2}, ${size / 2})`}
            style={{ fill: '#c9a84c', fontSize: size * 0.26, fontFamily: "'DM Sans', sans-serif" }}>
        {percent}%
      </text>
    </svg>
  )
}