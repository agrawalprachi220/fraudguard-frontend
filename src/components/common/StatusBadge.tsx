import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { RiskLevel, PredictionStatus } from "@/types/transaction";

const riskConfig: Record<RiskLevel, { className: string }> = {
  "Low Risk": {
    className:
      "border-transparent bg-success/15 text-success",
  },
  "Medium Risk": {
    className:
      "border-transparent bg-warning/15 text-warning",
  },
  "High Risk": {
    className:
      "border-transparent bg-destructive/15 text-destructive",
  },
};

const statusConfig: Record<
  PredictionStatus,
  { label: string; className: string }
> = {
  fraud: {
    label: "Fraud",
    className: "border-transparent bg-destructive/15 text-destructive",
  },
  legitimate: {
    label: "Legitimate",
    className: "border-transparent bg-success/15 text-success",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: PredictionStatus;
  className?: string;
}) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}

export function RiskBadge({
  level,
  className,
}: {
  level: RiskLevel;
  className?: string;
}) {
  const config = riskConfig[level];
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {level}
    </Badge>
  );
}
