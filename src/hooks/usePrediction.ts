import { useState } from "react";
import { analyzeTransaction } from "@/services/predictionService";
import { savePrediction } from "@/services/predictionStore";
import { getNotificationsEnabled } from "@/lib/preferences";
import { toast } from "@/hooks/use-toast";
import type {
  TransactionInput,
  PredictionResponse,
} from "@/types/transaction";

export type SaveStatus = "idle" | "saved" | "failed";

interface PredictionState {
  loading: boolean;
  result: PredictionResponse | null;
  error: string | null;
  saveStatus: SaveStatus;
}

export function usePrediction() {
  const [state, setState] = useState<PredictionState>({
    loading: false,
    result: null,
    error: null,
    saveStatus: "idle",
  });

  async function predict(input: TransactionInput) {
    setState({ loading: true, result: null, error: null, saveStatus: "idle" });
    try {
      const result = await analyzeTransaction(input);

      // Show the model result right away
      setState({ loading: false, result, error: null, saveStatus: "idle" });

      // Fraud alert, only when the user has notifications switched on
      if (result.is_fraud_predicted === 1 && getNotificationsEnabled()) {
        toast({
          variant: "destructive",
          title: "Fraud detected",
          description: `This transaction was flagged with a fraud probability of ${Math.round(
            result.fraud_probability * 100
          )}%.`,
        });
      }

      // Then save it to Supabase. A failed save must never hide the result.
      const saved = await savePrediction(input, result);
      setState((prev) => ({
        ...prev,
        saveStatus: saved ? "saved" : "failed",
      }));

      return result;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to analyze transaction. Please try again.";
      setState({
        loading: false,
        result: null,
        error: message,
        saveStatus: "idle",
      });
      return null;
    }
  }

  function reset() {
    setState({ loading: false, result: null, error: null, saveStatus: "idle" });
  }

  return { ...state, predict, reset };
}