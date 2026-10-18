import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  accent: "primary" | "success" | "destructive" | "warning";
}

const accentConfig = {
  primary: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    glow: "shadow-primary/5",
  border: "hover:border-primary/30",
  ring: "ring-primary/20",
  value: "text-primary",
  bar: "bg-primary",
  barGlow: "shadow-[0_0_12px_rgba(34,211,238,0.4)]",
  label: "text-primary/80",
  ring2: "from-primary/20 to-transparent",
  chip: "bg-primary/10 text-primary border-primary/20",
  dot: "bg-primary",
  gradient: "from-primary/5 to-transparent",
    borderHover: "hover:border-primary/40",
  shadow: "shadow-primary/10",
  barWidth: "w-full",
  ringProgress: "stroke-primary",
    textValue: "text-foreground",
    textLabel: "text-muted-foreground",
    iconWrap: "bg-primary/10",
    iconText: "text-primary",
  chipText: "text-primary",
    chipBg: "bg-primary/10",
    chipBorder: "border-primary/20",
    glowShadow: "shadow-[0_0_20px_-4px_rgba(34,211,238,0.3)]",
    topBar: "bg-primary",
  numberColor: "text-foreground",
    iconGradient: "from-primary/20 to-primary/5",
    cardBorder: "border-primary/20",
  hoverBorder: "hover:border-primary/40",
    hoverShadow: "hover:shadow-primary/20",
    progressColor: "bg-primary",
    iconBgColor: "bg-primary/10",
    iconColorClass: "text-primary",
  },
  success: {
    iconBg: "bg-success/10",
    iconColor: "text-success",
    glow: "shadow-success/5",
    border: "hover:border-success/30",
    ring: "ring-success/20",
    value: "text-success",
    bar: "bg-success",
    barGlow: "shadow-[0_0_12px_rgba(34,197,94,0.4)]",
    label: "text-success/80",
    ring2: "from-success/20 to-transparent",
    chip: "bg-success/10 text-success border-success/20",
    dot: "bg-success",
    gradient: "from-success/5 to-transparent",
    borderHover: "hover:border-success/40",
    shadow: "shadow-success/10",
    barWidth: "w-full",
    ringProgress: "stroke-success",
    textValue: "text-foreground",
    textLabel: "text-muted-foreground",
    iconWrap: "bg-success/10",
    iconText: "text-success",
    chipText: "text-success",
    chipBg: "bg-success/10",
    chipBorder: "border-success/20",
    glowShadow: "shadow-[0_0_20px_-4px_rgba(34,197,94,0.3)]",
    topBar: "bg-success",
    numberColor: "text-foreground",
    iconGradient: "from-success/20 to-success/5",
    cardBorder: "border-success/20",
    hoverBorder: "hover:border-success/40",
    hoverShadow: "hover:shadow-success/20",
    progressColor: "bg-success",
    iconBgColor: "bg-success/10",
    iconColorClass: "text-success",
  },
  destructive: {
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    glow: "shadow-destructive/5",
    border: "hover:border-destructive/30",
    ring: "ring-destructive/20",
    value: "text-destructive",
    bar: "bg-destructive",
    barGlow: "shadow-[0_0_12px_rgba(239,68,68,0.4)]",
    label: "text-destructive/80",
    ring2: "from-destructive/20 to-transparent",
    chip: "bg-destructive/10 text-destructive border-destructive/20",
    dot: "bg-destructive",
    gradient: "from-destructive/5 to-transparent",
    borderHover: "hover:border-destructive/40",
    shadow: "shadow-destructive/10",
    barWidth: "w-full",
    ringProgress: "stroke-destructive",
    textValue: "text-foreground",
    textLabel: "text-muted-foreground",
    iconWrap: "bg-destructive/10",
    iconText: "text-destructive",
    chipText: "text-destructive",
    chipBg: "bg-destructive/10",
    chipBorder: "border-destructive/20",
    glowShadow: "shadow-[0_0_20px_-4px_rgba(239,68,68,0.3)]",
    topBar: "bg-destructive",
    numberColor: "text-foreground",
    iconGradient: "from-destructive/20 to-destructive/5",
    cardBorder: "border-destructive/20",
    hoverBorder: "hover:border-destructive/40",
    hoverShadow: "hover:shadow-destructive/20",
    progressColor: "bg-destructive",
    iconBgColor: "bg-destructive/10",
    iconColorClass: "text-destructive",
  },
  warning: {
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    glow: "shadow-warning/5",
    border: "hover:border-warning/30",
    ring: "ring-warning/20",
    value: "text-warning",
    bar: "bg-warning",
    barGlow: "shadow-[0_0_12px_rgba(245,158,11,0.4)]",
    label: "text-warning/80",
    ring2: "from-warning/20 to-transparent",
    chip: "bg-warning/10 text-warning border-warning/20",
    dot: "bg-warning",
    gradient: "from-warning/5 to-transparent",
    borderHover: "hover:border-warning/40",
    shadow: "shadow-warning/10",
    barWidth: "w-full",
    ringProgress: "stroke-warning",
    textValue: "text-foreground",
    textLabel: "text-muted-foreground",
    iconWrap: "bg-warning/10",
    iconText: "text-warning",
    chipText: "text-warning",
    chipBg: "bg-warning/10",
    chipBorder: "border-warning/20",
    glowShadow: "shadow-[0_0_20px_-4px_rgba(245,158,11,0.3)]",
    topBar: "bg-warning",
    numberColor: "text-foreground",
    iconGradient: "from-warning/20 to-warning/5",
    cardBorder: "border-warning/20",
    hoverBorder: "hover:border-warning/40",
    hoverShadow: "hover:shadow-warning/20",
    progressColor: "bg-warning",
    iconBgColor: "bg-warning/10",
    iconColorClass: "text-warning",
  },
} as const;

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  accent,
}: StatCardProps) {
  const config = accentConfig[accent];
  return (
    <Card
      className={cn(
        "glass-card relative overflow-hidden border border-border p-5 transition-all duration-300 hover:-translate-y-0.5",
        config.hoverBorder,
        config.hoverShadow
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-0.5 opacity-60",
          config.topBar
        )}
      />
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            config.iconBgColor
          )}
        >
          <Icon className={cn("h-5.5 w-5.5", config.iconColorClass)} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium",
              trendUp
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {trendUp ? "↑" : "↓"} {trend}
          </span>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      )}
    </Card>
  );
}
