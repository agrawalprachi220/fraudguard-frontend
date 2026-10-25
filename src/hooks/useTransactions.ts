import { useState, useEffect, useCallback } from "react";
import type { PredictionRecord, RiskLevel } from "@/types/transaction";
import { supabase } from "@/services/supabase";

// Row shape of the `predictions` table in Supabase
interface PredictionRow {
  id: string;
  created_at: string;
  amount: number | string;
  transaction_hour: number;
  merchant_category: string;
  foreign_transaction: number;
  location_mismatch: number;
  device_trust_score: number;
  velocity_last_24h: number;
  cardholder_age: number;
  fraud_probability: number | string;
  is_fraud_predicted: number;
}

// Visual risk bands only (0-30 Low, 30-70 Medium, 70-100 High).
// The Fraud / Legitimate verdict always comes from is_fraud_predicted.
export function getRiskLevel(probability: number): RiskLevel {
  if (probability >= 0.7) return "High Risk";
  if (probability >= 0.3) return "Medium Risk";
  return "Low Risk";
}

function rowToRecord(row: PredictionRow): PredictionRecord {
  const probability = Number(row.fraud_probability);
  const amount = Number(row.amount);

  return {
    id: row.id,
    transaction_id: `TXN-${row.id.slice(0, 8).toUpperCase()}`,
    date_time: row.created_at,
    amount,
    merchant_category: row.merchant_category,
    fraud_probability: probability,
    is_fraud_predicted: row.is_fraud_predicted,
    risk_level: getRiskLevel(probability),
    input: {
      amount,
      transaction_hour: row.transaction_hour,
      merchant_category: row.merchant_category,
      foreign_transaction: row.foreign_transaction,
      location_mismatch: row.location_mismatch,
      device_trust_score: row.device_trust_score,
      velocity_last_24h: row.velocity_last_24h,
      cardholder_age: row.cardholder_age,
    },
  };
}

export interface TransactionStats {
  total: number;
  fraud: number;
  legitimate: number;
  fraudRate: number; // percent
  averageProbability: number; // percent
}

export function computeStats(records: PredictionRecord[]): TransactionStats {
  const total = records.length;
  const fraud = records.filter((r) => r.is_fraud_predicted === 1).length;
  const legitimate = total - fraud;
  const fraudRate = total > 0 ? (fraud / total) * 100 : 0;
  const averageProbability =
    total > 0
      ? (records.reduce((sum, r) => sum + r.fraud_probability, 0) / total) * 100
      : 0;

  return { total, fraud, legitimate, fraudRate, averageProbability };
}

export function useTransactions() {
  const [records, setRecords] = useState<PredictionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setRecords([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Row Level Security makes sure each user only receives their own rows.
    const { data, error: fetchError } = await supabase
      .from("predictions")
      .select(
        "id, created_at, amount, transaction_hour, merchant_category, foreign_transaction, location_mismatch, device_trust_score, velocity_last_24h, cardholder_age, fraud_probability, is_fraud_predicted"
      )
      .order("created_at", { ascending: false })
      .limit(1000);

    if (fetchError) {
      console.warn("Could not load predictions:", fetchError.message);
      setError("Unable to load prediction history.");
      setRecords([]);
    } else {
      setRecords((data as PredictionRow[]).map(rowToRecord));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addRecord = useCallback((record: PredictionRecord) => {
    setRecords((prev) => [record, ...prev]);
  }, []);

  return { records, loading, error, addRecord, refresh };
}