import {
  predictTransaction,
  checkHealth,
  ApiError,
  API_BASE_URL,
} from "./api";
import type { TransactionInput, PredictionResponse } from "@/types/transaction";

export { predictTransaction, checkHealth, ApiError, API_BASE_URL };

export async function analyzeTransaction(
  input: TransactionInput
): Promise<PredictionResponse> {
  try {
    return await predictTransaction(input);
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      "Unable to reach the fraud detection server. Please check that the backend is running."
    );
  }
}
