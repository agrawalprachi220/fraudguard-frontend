import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types/transaction";

interface RiskGaugeProps {
  probability: number;
  size?: number;
  strokeWidth?: number;
}

function getRiskLevel(prob: number): RiskLevel {
  if (prob >= 0.7) return "High Risk";
  if (prob >= 0.3) return "Medium Risk";
  return "Low Risk";
}

function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case "High Risk":
      return "hsl(0 72% 51%)";
    case "Medium Risk":
      return "hsl(38 92% 50%)";
    case "Low Risk":
      return "hsl(142 71% 45%)";
  }
}

export function RiskGauge({
  probability,
  size = 200,
  strokeWidth = 14,
}: RiskGaugeProps) {
  const percentage = Math.round(probability * 100);
  const level = getRiskLevel(probability);
  const color = getRiskColor(level);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(222 30% 14%)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1s ease-out, stroke 0.4s ease",
            filter: `drop-shadow(0 0 8px ${color})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-4xl font-bold tracking-tight"
          style={{ color }}
        >
          {percentage}%
        </span>
        <span
          className={cn(
            "mt-1 rounded-md px-2 py-0.5 text-xs font-semibold",
            level === "High Risk" && "bg-destructive/15 text-destructive",
            level === "Medium Risk" && "bg-warning/15 text-warning",
            level === "Low Risk" && "bg-success/15 text-success"
          )}
        >
          {level}
        </span>
      </div>
    </div>
  );
}
