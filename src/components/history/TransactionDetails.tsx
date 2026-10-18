import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge, RiskBadge } from "@/components/common/StatusBadge";
import { RiskGauge } from "@/components/prediction/RiskGauge";
import { Download, FileText } from "lucide-react";
import type { PredictionRecord } from "@/types/transaction";

interface TransactionDetailsProps {
  record: PredictionRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetails({
  record,
  open,
  onOpenChange,
}: TransactionDetailsProps) {
  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-border">
        <DialogHeader>
          <DialogTitle className="text-lg">Transaction Details</DialogTitle>
          <DialogDescription>
            Full prediction breakdown for {record.transaction_id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <RiskGauge probability={record.fraud_probability} size={160} />
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap gap-2">
                <StatusBadge
                  status={
                    record.is_fraud_predicted === 1 ? "fraud" : "legitimate"
                  }
                />
                <RiskBadge level={record.risk_level} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Transaction ID
                  </p>
                  <p className="font-mono text-xs font-medium">
                    {record.transaction_id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Prediction Date
                  </p>
                  <p className="font-medium">
                    {new Date(record.date_time).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Fraud Probability
                  </p>
                  <p className="font-bold">
                    {Math.round(record.fraud_probability * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-bold">
                    ₹{record.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Input Features
            </h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <DetailItem label="Amount" value={`₹${record.input.amount.toLocaleString()}`} />
              <DetailItem label="Hour" value={`${record.input.transaction_hour}:00`} />
              <DetailItem label="Category" value={record.input.merchant_category} />
              <DetailItem
                label="Foreign"
                value={record.input.foreign_transaction ? "Yes" : "No"}
              />
              <DetailItem
                label="Loc. Mismatch"
                value={record.input.location_mismatch ? "Yes" : "No"}
              />
              <DetailItem
                label="Device Trust"
                value={String(record.input.device_trust_score)}
              />
              <DetailItem
                label="Velocity 24h"
                value={String(record.input.velocity_last_24h)}
              />
              <DetailItem
                label="Age"
                value={String(record.input.cardholder_age)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" disabled>
              <Download className="mr-2 h-4 w-4" />
              Download PDF Report
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            PDF report download requires a backend report endpoint to be
            configured.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/30 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
