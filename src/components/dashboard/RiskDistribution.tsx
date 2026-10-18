import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  Cell,
} from "recharts";
import { RISK_DISTRIBUTION } from "@/lib/mockData";
import { Card } from "@/components/ui/card";

export function RiskDistribution() {
  const total = RISK_DISTRIBUTION.reduce((s, d) => s + d.value, 0);

  return (
    <Card className="glass-card border-border p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">
          Risk Distribution
        </h3>
        <p className="text-sm text-muted-foreground">
          Transactions categorized by risk level
        </p>
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative h-[180px] w-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={RISK_DISTRIBUTION}
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, total]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background={{ fill: "hsl(222 30% 14%)" }}
                dataKey="value"
                cornerRadius={6}
              >
                {RISK_DISTRIBUTION.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </RadialBar>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-3">
          {RISK_DISTRIBUTION.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {item.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {item.value.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {((item.value / total) * 100).toFixed(1)}% of total
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
