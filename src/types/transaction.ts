export interface TransactionInput {
  amount: number;
  transaction_hour: number;
  merchant_category: string;
  foreign_transaction: number;
  location_mismatch: number;
  device_trust_score: number;
  velocity_last_24h: number;
  cardholder_age: number;
}

export interface PredictionResponse {
  fraud_probability: number;
  is_fraud_predicted: number;
}

export type RiskLevel = "Low Risk" | "Medium Risk" | "High Risk";

export type PredictionStatus = "fraud" | "legitimate";

export interface PredictionRecord {
  id: string;
  transaction_id: string;
  date_time: string;
  amount: number;
  merchant_category: string;
  fraud_probability: number;
  is_fraud_predicted: number;
  risk_level: RiskLevel;
  input: TransactionInput;
}

export const MERCHANT_CATEGORIES = [
  "Electronics",
  "Travel",
  "Food",
  "Clothing",
  "Grocery",
] as const;

export type MerchantCategory = (typeof MERCHANT_CATEGORIES)[number];
