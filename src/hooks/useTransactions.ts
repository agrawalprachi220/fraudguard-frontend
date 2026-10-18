import { useState, useEffect, useCallback } from "react";
import type { PredictionRecord } from "@/types/transaction";
import { MOCK_HISTORY } from "@/lib/mockData";

export function useTransactions() {
  const [records, setRecords] = useState<PredictionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRecords(MOCK_HISTORY);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const addRecord = useCallback((record: PredictionRecord) => {
    setRecords((prev) => [record, ...prev]);
  }, []);

  return { records, loading, addRecord };
}
