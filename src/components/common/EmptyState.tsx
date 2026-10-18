import { cn } from "@/lib/utils";
import { ShieldX, type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = ShieldX,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 text-center",
        className
      )}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
