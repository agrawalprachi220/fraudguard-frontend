import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { PredictionTable } from "@/components/history/PredictionTable";
import { PredictionFilters, type StatusFilter } from "@/components/history/PredictionFilters";
import { TransactionDetails } from "@/components/history/TransactionDetails";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/hooks/useTransactions";
import type { PredictionRecord } from "@/types/transaction";
import { ShieldX, ScanSearch } from "lucide-react";

interface PredictionHistoryProps {
  onNavigateToAnalysis: () => void;
}

export function PredictionHistory({ onNavigateToAnalysis }: PredictionHistoryProps) {
  const { records, loading } = useTransactions();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PredictionRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (search && !r.transaction_id.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (status === "fraud" && r.is_fraud_predicted !== 1) return false;
      if (status === "legitimate" && r.is_fraud_predicted !== 0) return false;
      if (category !== "all" && r.merchant_category !== category) return false;
      return true;
    });
  }, [records, search, status, category]);

  function handleViewDetails(record: PredictionRecord) {
    setSelected(record);
    setDetailsOpen(true);
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card border-border p-5">
        <PredictionFilters
          search={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          status={status}
          onStatusChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          category={category}
          onCategoryChange={(v) => {
            setCategory(v);
            setPage(1);
          }}
        />
      </Card>

      {filtered.length === 0 && !loading ? (
        <Card className="glass-card border-border p-6">
          {records.length === 0 ? (
            <EmptyState
              icon={ShieldX}
              title="No Predictions Yet"
              description="Analyze your first transaction to see prediction history here."
              action={
                <Button
                  onClick={onNavigateToAnalysis}
                  className="bg-gradient-to-r from-primary to-accent text-white"
                >
                  <ScanSearch className="mr-2 h-4 w-4" />
                  Analyze Transaction
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={ShieldX}
              title="No Matching Records"
              description="Try adjusting your filters or search query to find predictions."
            />
          )}
        </Card>
      ) : (
        <PredictionTable
          records={filtered}
          loading={loading}
          onViewDetails={handleViewDetails}
          page={page}
          pageSize={10}
          onPageChange={setPage}
        />
      )}

      <TransactionDetails
        record={selected}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
}
