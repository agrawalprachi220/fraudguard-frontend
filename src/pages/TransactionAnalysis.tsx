import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TransactionForm } from "@/components/prediction/TransactionForm";
import { PredictionResult } from "@/components/prediction/PredictionResult";
import { TransactionSummary } from "@/components/prediction/TransactionSummary";
import { usePrediction } from "@/hooks/usePrediction";
import { useToast } from "@/hooks/use-toast";
import { useTransactions } from "@/hooks/useTransactions";
import type { TransactionInput, PredictionRecord } from "@/types/transaction";
import { getRiskLevel } from "@/types/prediction";
import { ScanSearch } from "lucide-react";

interface TransactionAnalysisProps {
  onNavigateToHistory: () => void;
}

export function TransactionAnalysis({ onNavigateToHistory }: TransactionAnalysisProps) {
  const { loading, result, error, predict } = usePrediction();
  const { toast } = useToast();
  const { addRecord } = useTransactions();
  const [lastInput, setLastInput] = useState<TransactionInput | null>(null);

  async function handleSubmit(input: TransactionInput) {
    setLastInput(input);
    const res = await predict(input);
    if (res) {
      const record: PredictionRecord = {
        id: Math.random().toString(36).slice(2, 10),
        transaction_id: `TXN-${Date.now().toString().slice(-6)}`,
        date_time: new Date().toISOString(),
        amount: input.amount,
        merchant_category: input.merchant_category,
        fraud_probability: res.fraud_probability,
        is_fraud_predicted: res.is_fraud_predicted,
        risk_level: getRiskLevel(res.fraud_probability),
        input,
      };
      addRecord(record);

      toast({
        title:
          res.is_fraud_predicted === 1
            ? "Fraud Detected"
            : "Transaction Appears Legitimate",
        description: `Fraud probability: ${Math.round(res.fraud_probability * 100)}%`,
      });
    } else {
      toast({
        title: "Unable to analyze transaction",
        description:
          "Fraud detection server is currently unavailable. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
        <ScanSearch className="h-5 w-5 text-primary" />
        <p className="text-sm text-muted-foreground">
          Enter the 8 transaction features below. The backend ML model will
          calculate the fraud probability and prediction.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card border-border p-6">
          <h2 className="mb-1 text-lg font-semibold text-foreground">
            Transaction Details
          </h2>
          <p className="mb-5 text-sm text-muted-foreground">
            Fill in all fields to run the fraud detection model.
          </p>
          <TransactionForm onSubmit={handleSubmit} loading={loading} />
        </Card>

        <div className="space-y-4">
          <PredictionResult result={result} loading={loading} error={error} />
          {result && lastInput && <TransactionSummary input={lastInput} />}
        </div>
      </div>

      {result && (
        <div className="flex justify-end">
          <button
            onClick={onNavigateToHistory}
            className="text-sm text-primary hover:underline"
          >
            View Prediction History →
          </button>
        </div>
      )}
    </div>
  );
}
