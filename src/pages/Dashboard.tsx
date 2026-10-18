import { StatCard } from "@/components/dashboard/StatCard";
import { TransactionOverview } from "@/components/dashboard/TransactionOverview";
import { FraudDistribution } from "@/components/dashboard/FraudDistribution";
import { MerchantFraudChart } from "@/components/dashboard/MerchantFraudChart";
import { RiskDistribution } from "@/components/dashboard/RiskDistribution";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiStatus } from "@/components/common/ApiStatus";
import { DASHBOARD_STATS } from "@/lib/mockData";
import {
  CreditCard,
  ShieldAlert,
  ShieldCheck,
  Percent,
} from "lucide-react";
import { useEffect, useState } from "react";

export function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <ApiStatus />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
          ))
        ) : (
          <>
            <StatCard
              title="Total Transactions"
              value={DASHBOARD_STATS.totalTransactions.toLocaleString()}
              icon={CreditCard}
              trend="12.5%"
              trendUp
              accent="primary"
            />
            <StatCard
              title="Fraud Detected"
              value={DASHBOARD_STATS.fraudDetected.toLocaleString()}
              icon={ShieldAlert}
              trend="3.2%"
              trendUp
              accent="destructive"
            />
            <StatCard
              title="Legitimate Transactions"
              value={DASHBOARD_STATS.legitimateTransactions.toLocaleString()}
              icon={ShieldCheck}
              trend="8.7%"
              trendUp
              accent="success"
            />
            <StatCard
              title="Fraud Rate"
              value={`${DASHBOARD_STATS.fraudRate.toFixed(1)}%`}
              icon={Percent}
              trend="0.4%"
              trendUp={false}
              accent="warning"
            />
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {loading ? (
            <Skeleton className="h-[340px] w-full rounded-xl" />
          ) : (
            <TransactionOverview />
          )}
        </div>
        <div>
          {loading ? (
            <Skeleton className="h-[340px] w-full rounded-xl" />
          ) : (
            <FraudDistribution />
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {loading ? (
          <>
            <Skeleton className="h-[340px] w-full rounded-xl" />
            <Skeleton className="h-[340px] w-full rounded-xl" />
          </>
        ) : (
          <>
            <MerchantFraudChart />
            <RiskDistribution />
          </>
        )}
      </div>
    </div>
  );
}
