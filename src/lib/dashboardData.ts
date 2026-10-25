import type { PredictionRecord, RiskLevel } from "@/types/transaction";
import { MERCHANT_CATEGORIES } from "@/types/transaction";

export const CHART_COLORS = {
  legitimate: "hsl(142 71% 45%)",
  fraud: "hsl(0 72% 51%)",
  medium: "hsl(38 92% 50%)",
};

export interface OverviewPoint {
  date: string;
  total: number;
  fraud: number;
  legitimate: number;
}

export interface DistributionSlice {
  name: string;
  value: number;
  color: string;
}

export interface MerchantPoint {
  category: string;
  fraud: number;
  total: number;
}

// Daily totals for the most recent days that have predictions.
// If every prediction is from the same day, group by hour instead
// so the chart still shows a line rather than a single dot.
export function buildDailyOverview(
  records: PredictionRecord[],
  maxPoints = 14
): OverviewPoint[] {
  const pad = (n: number) => String(n).padStart(2, "0");
  const dayKey = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const distinctDays = new Set(
    records.map((r) => dayKey(new Date(r.date_time)))
  );
  const byHour = distinctDays.size < 2;

  const buckets = new Map<string, OverviewPoint>();

  for (const r of records) {
    const d = new Date(r.date_time);
    const key = byHour ? `${dayKey(d)}-${pad(d.getHours())}` : dayKey(d);
    const label = byHour
      ? `${pad(d.getHours())}:00`
      : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

    const point = buckets.get(key) ?? {
      date: label,
      total: 0,
      fraud: 0,
      legitimate: 0,
    };
    point.total += 1;
    if (r.is_fraud_predicted === 1) point.fraud += 1;
    else point.legitimate += 1;
    buckets.set(key, point);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-maxPoints)
    .map(([, point]) => point);
}

export function buildFraudDistribution(
  records: PredictionRecord[]
): DistributionSlice[] {
  const fraud = records.filter((r) => r.is_fraud_predicted === 1).length;
  return [
    {
      name: "Legitimate",
      value: records.length - fraud,
      color: CHART_COLORS.legitimate,
    },
    { name: "Fraud", value: fraud, color: CHART_COLORS.fraud },
  ];
}

export function buildMerchantFraud(
  records: PredictionRecord[]
): MerchantPoint[] {
  return MERCHANT_CATEGORIES.map((category) => {
    const inCategory = records.filter((r) => r.merchant_category === category);
    return {
      category,
      total: inCategory.length,
      fraud: inCategory.filter((r) => r.is_fraud_predicted === 1).length,
    };
  });
}

export function buildRiskDistribution(
  records: PredictionRecord[]
): DistributionSlice[] {
  const count = (level: RiskLevel) =>
    records.filter((r) => r.risk_level === level).length;

  return [
    {
      name: "Low Risk",
      value: count("Low Risk"),
      color: CHART_COLORS.legitimate,
    },
    {
      name: "Medium Risk",
      value: count("Medium Risk"),
      color: CHART_COLORS.medium,
    },
    {
      name: "High Risk",
      value: count("High Risk"),
      color: CHART_COLORS.fraud,
    },
  ];
}