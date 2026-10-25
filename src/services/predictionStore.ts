import { supabase } from "@/services/supabase";
import type {
  TransactionInput,
  PredictionResponse,
} from "@/types/transaction";

/**
 * Saves one prediction to the Supabase `predictions` table.
 * user_id is filled automatically by the database (auth.uid()),
 * so we never send it from the browser.
 * Returns true on success, false on failure (never throws).
 */
export async function savePrediction(
  input: TransactionInput,
  result: PredictionResponse
): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase.from("predictions").insert({
    amount: input.amount,
    transaction_hour: input.transaction_hour,
    merchant_category: input.merchant_category,
    foreign_transaction: input.foreign_transaction,
    location_mismatch: input.location_mismatch,
    device_trust_score: input.device_trust_score,
    velocity_last_24h: input.velocity_last_24h,
    cardholder_age: input.cardholder_age,
    fraud_probability: result.fraud_probability,
    is_fraud_predicted: result.is_fraud_predicted,
  });

  if (error) {
    console.warn("Could not save prediction:", error.message);
    return false;
  }
  return true;
}