import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, RotateCcw, ScanSearch, Info } from "lucide-react";
import type { TransactionInput } from "@/types/transaction";
import { MERCHANT_CATEGORIES } from "@/types/transaction";

interface TransactionFormProps {
  onSubmit: (input: TransactionInput) => void;
  loading: boolean;
}

const DEFAULT_VALUES: TransactionInput = {
  amount: 25000,
  transaction_hour: 3,
  merchant_category: "Electronics",
  foreign_transaction: 1,
  location_mismatch: 1,
  device_trust_score: 10,
  velocity_last_24h: 18,
  cardholder_age: 24,
};

function SegmentedToggle({
  value,
  onChange,
  labels,
}: {
  value: number;
  onChange: (v: number) => void;
  labels: [string, string];
}) {
  return (
    <div className="flex overflow-hidden rounded-lg border border-border">
      <button
        type="button"
        onClick={() => onChange(0)}
        className={cn(
          "flex-1 px-4 py-2 text-sm font-medium transition-colors",
          value === 0
            ? "bg-primary text-primary-foreground"
            : "bg-transparent text-muted-foreground hover:bg-accent/50"
        )}
      >
        {labels[0]}
      </button>
      <button
        type="button"
        onClick={() => onChange(1)}
        className={cn(
          "flex-1 px-4 py-2 text-sm font-medium transition-colors",
          value === 1
            ? "bg-primary text-primary-foreground"
            : "bg-transparent text-muted-foreground hover:bg-accent/50"
        )}
      >
        {labels[1]}
      </button>
    </div>
  );
}

export function TransactionForm({ onSubmit, loading }: TransactionFormProps) {
  const [form, setForm] = useState<TransactionInput>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<Partial<Record<keyof TransactionInput, string>>>({});

  function update<K extends keyof TransactionInput>(key: K, value: TransactionInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof TransactionInput, string>> = {};
    if (form.amount <= 0) e.amount = "Amount must be greater than 0.";
    if (form.transaction_hour < 0 || form.transaction_hour > 23)
      e.transaction_hour = "Hour must be between 0 and 23.";
    if (!form.merchant_category) e.merchant_category = "Select a category.";
    if (form.cardholder_age < 18 || form.cardholder_age > 100)
      e.cardholder_age = "Age must be between 18 and 100.";
    if (form.velocity_last_24h < 0)
      e.velocity_last_24h = "Cannot be negative.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate() || loading) return;
    onSubmit(form);
  }

  function handleReset() {
    setForm(DEFAULT_VALUES);
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-start gap-2 rounded-lg border border-warning/20 bg-warning/5 px-3 py-2.5">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <p className="text-xs text-muted-foreground">
          Do not enter real card numbers, CVV, PINs, OTPs, or banking
          credentials. This is an ML demonstration using transaction features
          only.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="amount">Transaction Amount</Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              ₹
            </span>
            <Input
              id="amount"
              type="number"
              min={0}
              placeholder="Enter transaction amount"
              value={form.amount || ""}
              onChange={(e) => update("amount", Number(e.target.value))}
              className="pl-7"
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-destructive">{errors.amount}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="transaction_hour">Transaction Hour</Label>
          <Input
            id="transaction_hour"
            type="number"
            min={0}
            max={23}
            placeholder="Enter hour (0-23)"
            value={form.transaction_hour}
            onChange={(e) => update("transaction_hour", Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Hour when the transaction occurred.
          </p>
          {errors.transaction_hour && (
            <p className="text-xs text-destructive">
              {errors.transaction_hour}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Merchant Category</Label>
          <Select
            value={form.merchant_category}
            onValueChange={(v) => update("merchant_category", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {MERCHANT_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.merchant_category && (
            <p className="text-xs text-destructive">
              {errors.merchant_category}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Foreign Transaction</Label>
          <SegmentedToggle
            value={form.foreign_transaction}
            onChange={(v) => update("foreign_transaction", v)}
            labels={["No", "Yes"]}
          />
        </div>

        <div className="space-y-2">
          <Label>Location Mismatch</Label>
          <SegmentedToggle
            value={form.location_mismatch}
            onChange={(v) => update("location_mismatch", v)}
            labels={["No", "Yes"]}
          />
          <p className="text-xs text-muted-foreground">
            Whether the transaction location differs from the expected
            cardholder location.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="velocity_last_24h">Transaction Velocity</Label>
          <Input
            id="velocity_last_24h"
            type="number"
            min={0}
            placeholder="Enter number of transactions"
            value={form.velocity_last_24h}
            onChange={(e) => update("velocity_last_24h", Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Number of transactions in the last 24 hours.
          </p>
          {errors.velocity_last_24h && (
            <p className="text-xs text-destructive">
              {errors.velocity_last_24h}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardholder_age">Cardholder Age</Label>
          <Input
            id="cardholder_age"
            type="number"
            min={18}
            max={100}
            placeholder="Enter age"
            value={form.cardholder_age}
            onChange={(e) => update("cardholder_age", Number(e.target.value))}
          />
          {errors.cardholder_age && (
            <p className="text-xs text-destructive">{errors.cardholder_age}</p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <div className="flex items-center justify-between">
            <Label>Device Trust Score</Label>
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {form.device_trust_score}
            </span>
          </div>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[form.device_trust_score]}
            onValueChange={(v) => update("device_trust_score", v[0])}
          />
          <p className="text-xs text-muted-foreground">
            Higher values represent a more trusted device.
          </p>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Transaction...
            </>
          ) : (
            <>
              <ScanSearch className="mr-2 h-4 w-4" />
              Analyze Transaction
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={loading}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </form>
  );
}
