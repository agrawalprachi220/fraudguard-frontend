import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge, RiskBadge } from "@/components/common/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye } from "lucide-react";
import type { PredictionRecord } from "@/types/transaction";

interface PredictionTableProps {
  records: PredictionRecord[];
  loading: boolean;
  onViewDetails: (record: PredictionRecord) => void;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function PredictionTable({
  records,
  loading,
  onViewDetails,
  page,
  pageSize,
  onPageChange,
}: PredictionTableProps) {
  const totalPages = Math.ceil(records.length / pageSize);
  const paged = records.slice((page - 1) * pageSize, page * pageSize);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Fraud Prob.</TableHead>
              <TableHead>Prediction</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((r) => (
              <TableRow key={r.id} className="border-border">
                <TableCell className="font-mono text-xs">
                  {r.transaction_id}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(r.date_time).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell className="font-medium">
                  ₹{r.amount.toLocaleString()}
                </TableCell>
                <TableCell>{r.merchant_category}</TableCell>
                <TableCell>
                  <span
                    className={
                      r.fraud_probability >= 0.7
                        ? "text-destructive font-semibold"
                        : r.fraud_probability >= 0.3
                          ? "text-warning font-semibold"
                          : "text-success font-semibold"
                    }
                  >
                    {Math.round(r.fraud_probability * 100)}%
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={r.is_fraud_predicted === 1 ? "fraud" : "legitimate"}
                  />
                </TableCell>
                <TableCell>
                  <RiskBadge level={r.risk_level} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(r)}
                    className="h-8 gap-1.5 text-xs"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} · {records.length} records
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
