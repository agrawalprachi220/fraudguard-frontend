import type { TransactionInput, PredictionResponse } from "@/types/transaction";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new ApiError(
      `Request failed with status ${res.status}`,
      res.status
    );
  }
  return (await res.json()) as T;
}

export async function checkHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API_BASE_URL}/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

export async function predictTransaction(
  input: TransactionInput
): Promise<PredictionResponse> {
  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseResponse<PredictionResponse>(res);
}

export { API_BASE_URL };
