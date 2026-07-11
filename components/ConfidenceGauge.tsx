"use client";
export default function ConfidenceGauge({ score, color }: { score: number; color: string }) {
  const radius = 60;
  const stroke = 12;
  const cx = 75;
  const cy = 72;
  const circumference = Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center mt-2">
      <svg width="150" height="90" viewBox="0 0 150 90">

        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke="#1e2535"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
        />

        <text x={cx} y={cy - 10} textAnchor="middle" fill={color} fontSize="26" fontWeight="700" fontFamily="monospace">
          {score}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="#6b7a99" fontSize="9" fontFamily="monospace">
          CONFIDENCE
        </text>
      </svg>
    </div>
  );
}
