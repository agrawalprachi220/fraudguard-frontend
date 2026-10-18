import { Card } from "@/components/ui/card";
import type { TransactionInput } from "@/types/transaction";

interface TransactionSummaryProps {
  input: TransactionInput;
}

const LABELS: { key: keyof TransactionInput; label: string; format?: (v: number) => string }[] = [
  { key: "amount", label: "Amount", format: (v) => `₹${v.toLocaleString()}` },
  { key: "transaction_hour", label: "Transaction Hour", format: (v) => `${v}:00` },
  { key: "merchant_category", label: "Merchant Category" },
  { key: "foreign_transaction", label: "Foreign Transaction", format: (v) => (v ? "Yes" : "No") },
  { key: "location_mismatch", label: "Location Mismatch", format: (v) => (v ? "Yes" : "No") },
  { key: "device_trust_score", label: "Device Trust Score" },
  { key: "velocity_last_24h", label: "Transactions Last 24h" },
  { key: "cardholder_age", label: "Cardholder Age" },
];

export function TransactionSummary({ input }: TransactionSummaryProps) {
  return (
    <Card className="glass-card border-border p-5">
      <h3 className="mb-4 text-base font-semibold text-foreground">
        Transaction Details
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {LABELS.map((item) => {
          const value = input[item.key];
          const display =
            typeof value === "number" && item.format
              ? item.format(value)
              : String(value);
          return (
            <div
              key={item.key}
              className="rounded-lg border border-border bg-card/30 px-3 py-2.5"
            >
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="mt-0.5 text-sm font-medium text-foreground">
                {display}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
