import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { MERCHANT_FRAUD } from "@/lib/mockData";
import { Card } from "@/components/ui/card";

export function MerchantFraudChart() {
  const data = MERCHANT_FRAUD.map((d) => ({
    category: d.category,
    fraud: d.fraud,
    rate: ((d.fraud / d.total) * 100).toFixed(1),
  }));

  return (
    <Card className="glass-card border-border p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">
          Merchant Category Fraud
        </h3>
        <p className="text-sm text-muted-foreground">
          Fraud count by merchant category
        </p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ left: -10 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(222 30% 16%)"
            vertical={false}
          />
          <XAxis
            dataKey="category"
            stroke="hsl(215 20% 65%)"
            fontSize={11}
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
            labelStyle={{ color: "hsl(215 20% 65%)" }}
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
          />
          <Bar dataKey="fraud" name="Fraud Count" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill="hsl(0 72% 51%)" fillOpacity={0.7 + i * 0.03} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
