"use client";
export default function FinancialStrengthGauge({ score }: { score: number }) {
  const radius = 54;
  const stroke = 10;
  const cx = 70;
  const cy = 70;
  const circumference = Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 70 ? "#34D399" : score >= 40 ? "#FBBF24" : "#F87171";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="140" height="80" viewBox="0 0 140 80">

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
          style={{ transition: "stroke-dashoffset 1s ease, stroke 0.3s ease" }}
        />

        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fill={color}
          fontSize="22"
          fontWeight="700"
          fontFamily="monospace"
        >
          {score}
        </text>
        <text
          x={cx}
          y={cy + 8}
          textAnchor="middle"
          fill="#6b7a99"
          fontSize="9"
          fontFamily="monospace"
        >
          / 100
        </text>
      </svg>
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
        Financial Strength
      </span>
    </div>
  );
}
