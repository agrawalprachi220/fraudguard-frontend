export type {
  TransactionInput,
  PredictionResponse,
  RiskLevel,
  PredictionStatus,
  PredictionRecord,
  MERCHANT_CATEGORIES,
  MerchantCategory,
} from "./transaction";

export function getRiskLevel(probability: number): import("./transaction").RiskLevel {
  if (probability >= 0.7) return "High Risk";
  if (probability >= 0.3) return "Medium Risk";
  return "Low Risk";
}
