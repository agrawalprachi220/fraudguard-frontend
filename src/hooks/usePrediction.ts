import { useState } from "react";
import { analyzeTransaction } from "@/services/predictionService";
import type {
  TransactionInput,
  PredictionResponse,
} from "@/types/transaction";

interface PredictionState {
  loading: boolean;
  result: PredictionResponse | null;
  error: string | null;
}

export function usePrediction() {
  const [state, setState] = useState<PredictionState>({
    loading: false,
    result: null,
    error: null,
  });

  async function predict(input: TransactionInput) {
    setState({ loading: true, result: null, error: null });
    try {
      const result = await analyzeTransaction(input);
      setState({ loading: false, result, error: null });
      return result;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to analyze transaction. Please try again.";
      setState({ loading: false, result: null, error: message });
      return null;
    }
  }

  function reset() {
    setState({ loading: false, result: null, error: null });
  }

  return { ...state, predict, reset };
}
