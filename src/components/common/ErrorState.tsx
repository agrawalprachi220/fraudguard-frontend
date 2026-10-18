import { cn } from "@/lib/utils";
import { AlertCircle, type LucideIcon } from "lucide-react";

interface ErrorStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function ErrorState({
  icon: Icon = AlertCircle,
  title,
  description,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-12 text-center",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <Icon className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
