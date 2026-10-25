import { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreditCard,
  ShieldAlert,
  ShieldCheck,
  Percent,
  Activity,
  Inbox,
} from "lucide-react";
import { useTransactions, computeStats } from "@/hooks/useTransactions";
import {
  buildDailyOverview,
  buildFraudDistribution,
  buildMerchantFraud,
} from "@/lib/dashboardData";
import { buildProbabilityDistribution } from "@/lib/analyticsData";

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(222 40% 9%)",
  border: "1px solid hsl(222 30% 16%)",
  borderRadius: "8px",
  fontSize: "12px",
};

export function Analytics() {
  const { records, loading, error } = useTransactions();

  const stats = useMemo(() => computeStats(records), [records]);
  const distribution = useMemo(
    () => buildFraudDistribution(records),
    [records]
  );
  const trend = useMemo(() => buildDailyOverview(records, 30), [records]);
  const merchants = useMemo(() => buildMerchantFraud(records), [records]);
  const probabilities = useMemo(
    () => buildProbabilityDistribution(records),
    [records]
  );

  const hasData = records.length > 0;

  return (
    <div className="space-y-6">
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[110px] w-full rounded-xl" />
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
              title="Fraud Transactions"
              value={stats.fraud.toLocaleString()}
              icon={ShieldAlert}
              accent="destructive"
            />
            <StatCard
              title="Legitimate"
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
            <StatCard
              title="Avg Fraud Prob."
              value={`${stats.averageProbability.toFixed(1)}%`}
              icon={Activity}
              accent="primary"
            />
          </>
        )}
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[340px] w-full rounded-xl" />
          ))}
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
            Analyze your first transaction in Transaction Analysis to see
            analytics here.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="glass-card border-border p-5">
            <h3 className="mb-1 text-base font-semibold text-foreground">
              Fraud vs Legitimate
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Overall distribution
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {distribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: "12px" }} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="glass-card border-border p-5">
            <h3 className="mb-1 text-base font-semibold text-foreground">
              Fraud Trend
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Fraud vs legitimate predictions over time
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(222 30% 16%)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="hsl(215 20% 65%)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(215 20% 65%)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: "12px" }} iconType="circle" />
                <Line
                  type="monotone"
                  dataKey="fraud"
                  name="Fraud"
                  stroke="hsl(0 72% 51%)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="legitimate"
                  name="Legitimate"
                  stroke="hsl(142 71% 45%)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="glass-card border-border p-5">
            <h3 className="mb-1 text-base font-semibold text-foreground">
              Fraud by Merchant Category
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Fraud count across categories
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={merchants} margin={{ left: -10 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(222 30% 16%)"
                  vertical={false}
                />
                <XAxis
                  dataKey="category"
                  stroke="hsl(215 20% 65%)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  angle={-25}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke="hsl(215 20% 65%)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} iconType="circle" />
                <Bar
                  dataKey="fraud"
                  name="Fraud Count"
                  fill="hsl(0 72% 51%)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="total"
                  name="Total Predictions"
                  fill="hsl(199 89% 48%)"
                  fillOpacity={0.5}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="glass-card border-border p-5">
            <h3 className="mb-1 text-base font-semibold text-foreground">
              Fraud Probability Distribution
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Histogram of fraud probability scores
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={probabilities} margin={{ left: -10 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(222 30% 16%)"
                  vertical={false}
                />
                <XAxis
                  dataKey="range"
                  stroke="hsl(215 20% 65%)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  angle={-25}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke="hsl(215 20% 65%)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Bar
                  dataKey="count"
                  name="Transaction Count"
                  fill="hsl(199 89% 48%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  );
}