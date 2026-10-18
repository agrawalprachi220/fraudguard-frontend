import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { FRAUD_DISTRIBUTION } from "@/lib/mockData";
import { Card } from "@/components/ui/card";

export function FraudDistribution() {
  return (
    <Card className="glass-card border-border p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">
          Fraud Distribution
        </h3>
        <p className="text-sm text-muted-foreground">
          Legitimate vs fraudulent transactions
        </p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={FRAUD_DISTRIBUTION}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
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
            labelStyle={{ color: "hsl(215 20% 65%)" }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
