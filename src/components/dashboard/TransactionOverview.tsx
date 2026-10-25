import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { OverviewPoint } from "@/lib/dashboardData";
import { Card } from "@/components/ui/card";

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-semibold text-foreground">{label}</p>
      {payload.map((item, i) => (
        <p key={i} className="text-xs" style={{ color: item.color }}>
          {item.name}: {item.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

interface TransactionOverviewProps {
  data: OverviewPoint[];
}

export function TransactionOverview({ data }: TransactionOverviewProps) {
  return (
    <Card className="glass-card border-border p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Transaction Overview
          </h3>
          <p className="text-sm text-muted-foreground">
            Daily predictions breakdown
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(222 30% 16%)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke="hsl(215 20% 65%)"
            fontSize={12}
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
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
            iconType="circle"
          />
          <Line
            type="monotone"
            dataKey="total"
            name="Total"
            stroke="hsl(199 89% 48%)"
            strokeWidth={2}
            dot={{ r: 3, fill: "hsl(199 89% 48%)" }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="fraud"
            name="Fraud"
            stroke="hsl(0 72% 51%)"
            strokeWidth={2}
            dot={{ r: 3, fill: "hsl(0 72% 51%)" }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="legitimate"
            name="Legitimate"
            stroke="hsl(142 71% 45%)"
            strokeWidth={2}
            dot={{ r: 3, fill: "hsl(142 71% 45%)" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}