import { useMemo } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { TransactionOverview } from "@/components/dashboard/TransactionOverview";
import { FraudDistribution } from "@/components/dashboard/FraudDistribution";
import { MerchantFraudChart } from "@/components/dashboard/MerchantFraudChart";
import { RiskDistribution } from "@/components/dashboard/RiskDistribution";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ApiStatus } from "@/components/common/ApiStatus";
import { useTransactions, computeStats } from "@/hooks/useTransactions";
import {
  buildDailyOverview,
  buildFraudDistribution,
  buildMerchantFraud,
  buildRiskDistribution,
} from "@/lib/dashboardData";
import {
  CreditCard,
  ShieldAlert,
  ShieldCheck,
  Percent,
  Inbox,
} from "lucide-react";

export function Dashboard() {
  const { records, loading, error } = useTransactions();

  const stats = useMemo(() => computeStats(records), [records]);
  const overview = useMemo(() => buildDailyOverview(records), [records]);
  const fraudDistribution = useMemo(
    () => buildFraudDistribution(records),
    [records]
  );
  const merchantFraud = useMemo(() => buildMerchantFraud(records), [records]);
  const riskDistribution = useMemo(
    () => buildRiskDistribution(records),
    [records]
  );

  const hasData = records.length > 0;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <ApiStatus />
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
          ))
        ) : (
          <>
            <StatCard
              title="Total Transactions"
              value={stats.total.toLocaleString()}
              icon={CreditCard}
              accent="primary"
            />
            <StatCard
              title="Fraud Detected"
              value={stats.fraud.toLocaleString()}
              icon={ShieldAlert}
              accent="destructive"
            />
            <StatCard
              title="Legitimate Transactions"
              value={stats.legitimate.toLocaleString()}
              icon={ShieldCheck}
              accent="success"
            />
            <StatCard
              title="Fraud Rate"
              value={`${stats.fraudRate.toFixed(1)}%`}
              icon={Percent}
              accent="warning"
            />
          </>
        )}
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-[340px] w-full rounded-xl" />
          </div>
          <Skeleton className="h-[340px] w-full rounded-xl" />
        </div>
      ) : !hasData ? (
        <Card className="glass-card flex flex-col items-center justify-center gap-3 border-border p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Inbox className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            No Predictions Yet
          </h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Analyze your first transaction in Transaction Analysis to see your
            statistics and charts here.
          </p>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TransactionOverview data={overview} />
            </div>
            <div>
              <FraudDistribution data={fraudDistribution} />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <MerchantFraudChart data={merchantFraud} />
            <RiskDistribution data={riskDistribution} />
          </div>
        </>
      )}
    </div>
  );
}