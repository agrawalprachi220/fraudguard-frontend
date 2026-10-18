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
} from "lucide-react";
import {
  FRAUD_DISTRIBUTION,
  FRAUD_TREND,
  MERCHANT_FRAUD,
  PROBABILITY_DISTRIBUTION,
  ANALYTICS_METRICS,
} from "@/lib/mockData";
import { useEffect, useState } from "react";

export function Analytics() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[110px] w-full rounded-xl" />
          ))
        ) : (
          <>
            <StatCard
              title="Total Transactions"
              value={ANALYTICS_METRICS.totalTransactions.toLocaleString()}
              icon={CreditCard}
              accent="primary"
            />
            <StatCard
              title="Fraud Transactions"
              value={ANALYTICS_METRICS.fraudTransactions.toLocaleString()}
              icon={ShieldAlert}
              accent="destructive"
            />
            <StatCard
              title="Legitimate"
              value={ANALYTICS_METRICS.legitimateTransactions.toLocaleString()}
              icon={ShieldCheck}
              accent="success"
            />
            <StatCard
              title="Fraud Rate"
              value={`${ANALYTICS_METRICS.fraudRate.toFixed(1)}%`}
              icon={Percent}
              accent="warning"
            />
            <StatCard
              title="Avg Fraud Prob."
              value={`${ANALYTICS_METRICS.averageFraudProbability.toFixed(1)}%`}
              icon={Activity}
              accent="primary"
            />
          </>
        )}
      </div>

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
                data={FRAUD_DISTRIBUTION}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {FRAUD_DISTRIBUTION.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 40% 9%)",
                  border: "1px solid hsl(222 30% 16%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass-card border-border p-5">
          <h3 className="mb-1 text-base font-semibold text-foreground">
            Fraud Trend
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Weekly fraud vs legitimate transactions
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={FRAUD_TREND}>
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
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 40% 9%)",
                  border: "1px solid hsl(222 30% 16%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                iconType="circle"
              />
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
            <BarChart
              data={MERCHANT_FRAUD.map((d) => ({
                category: d.category,
                fraud: d.fraud,
              }))}
              margin={{ left: -10 }}
            >
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
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 40% 9%)",
                  border: "1px solid hsl(222 30% 16%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Bar
                dataKey="fraud"
                name="Fraud Count"
                fill="hsl(0 72% 51%)"
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
            <BarChart
              data={PROBABILITY_DISTRIBUTION}
              margin={{ left: -10 }}
            >
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
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 40% 9%)",
                  border: "1px solid hsl(222 30% 16%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
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
    </div>
  );
}
