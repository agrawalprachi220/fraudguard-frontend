import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { RiskGauge } from "./RiskGauge";
import { RiskBadge } from "@/components/common/StatusBadge";
import type { PredictionResponse } from "@/types/transaction";
import { getRiskLevel } from "@/types/prediction";
import { ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";

interface PredictionResultProps {
  result: PredictionResponse | null;
  loading: boolean;
  error: string | null;
}

export function PredictionResult({ result, loading, error }: PredictionResultProps) {
  if (loading) {
    return (
      <Card className="glass-card flex min-h-[400px] flex-col items-center justify-center border-border p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-20 w-20 animate-pulse rounded-full bg-primary/10" />
            <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-primary" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-foreground">
              Analyzing Transaction
            </p>
            <p className="text-sm text-muted-foreground">
              Running ML model prediction...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-card flex min-h-[400px] flex-col items-center justify-center border-destructive/20 p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          Backend Not Connected
        </h3>
        <p className="mt-1 max-w-xs text-center text-sm text-muted-foreground">
          {error}
        </p>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="glass-card flex min-h-[400px] flex-col items-center justify-center border-border p-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/40">
          <ShieldCheck className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          Awaiting Analysis
        </h3>
        <p className="mt-1 max-w-xs text-center text-sm text-muted-foreground">
          Enter the transaction details and click "Analyze Transaction" to
          see the fraud prediction.
        </p>
      </Card>
    );
  }

  const isFraud = result.is_fraud_predicted === 1;
  const probability = result.fraud_probability;
  const riskLevel = getRiskLevel(probability);

  return (
    <Card
      className={cn(
        "glass-card animate-fade-in overflow-hidden border-border p-6",
        isFraud ? "border-destructive/30" : "border-success/30"
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1",
          isFraud ? "bg-destructive" : "bg-success"
        )}
      />
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl",
            isFraud
              ? "bg-destructive/10 animate-pulse-glow"
              : "bg-success/10"
          )}
        >
          {isFraud ? (
            <ShieldAlert className="h-7 w-7 text-destructive" />
          ) : (
            <ShieldCheck className="h-7 w-7 text-success" />
          )}
        </div>

        <h3
          className={cn(
            "mt-4 text-xl font-bold tracking-tight",
            isFraud ? "text-destructive" : "text-success"
          )}
        >
          {isFraud ? "FRAUD DETECTED" : "TRANSACTION APPEARS LEGITIMATE"}
        </h3>

        <div className="mt-6">
          <RiskGauge probability={probability} />
        </div>

        <div className="mt-5 space-y-1 text-center">
          <p className="text-sm text-muted-foreground">Fraud Probability</p>
          <p
            className={cn(
              "text-3xl font-bold",
              isFraud ? "text-destructive" : "text-success"
            )}
          >
            {Math.round(probability * 100)}%
          </p>
        </div>

        <div className="mt-4">
          <RiskBadge level={riskLevel} />
        </div>

        <p className="mt-4 max-w-xs text-center text-xs text-muted-foreground">
          {isFraud
            ? "This transaction has been flagged as potentially fraudulent by the ML model. Further review is recommended."
            : "This transaction appears legitimate based on the ML model's analysis of the provided features."}
        </p>
      </div>
    </Card>
  );
}
