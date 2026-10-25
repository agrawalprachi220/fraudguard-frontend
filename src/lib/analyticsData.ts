import type { PredictionRecord } from "@/types/transaction";

export interface ProbabilityBin {
  range: string;
  count: number;
}

// Histogram of fraud probability scores in 10% bins (0-10%, 10-20%, ... 90-100%)
export function buildProbabilityDistribution(
  records: PredictionRecord[]
): ProbabilityBin[] {
  const bins: ProbabilityBin[] = Array.from({ length: 10 }, (_, i) => ({
    range: `${i * 10}-${(i + 1) * 10}%`,
    count: 0,
  }));

  for (const r of records) {
    const index = Math.min(9, Math.max(0, Math.floor(r.fraud_probability * 10)));
    bins[index].count += 1;
  }

  return bins;
}