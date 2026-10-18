import { useEffect, useState, useCallback } from "react";
import { checkHealth } from "@/services/api";
import { cn } from "@/lib/utils";
import { Loader2, RefreshCw, Wifi, WifiOff } from "lucide-react";

type Status = "checking" | "connected" | "offline";

export function ApiStatus({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>("checking");

  const check = useCallback(async () => {
    setStatus("checking");
    const ok = await checkHealth();
    setStatus(ok ? "connected" : "offline");
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {status === "checking" && (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
        )}
        {status === "connected" && (
          <span className="h-2 w-2 rounded-full bg-success" />
        )}
        {status === "offline" && (
          <span className="h-2 w-2 rounded-full bg-destructive" />
        )}
        <span
          className={cn(
            "text-xs font-medium",
            status === "connected" && "text-success",
            status === "offline" && "text-destructive",
            status === "checking" && "text-muted-foreground"
          )}
        >
          {status === "connected" && "API Connected"}
          {status === "offline" && "API Offline"}
          {status === "checking" && "Checking..."}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card/50 px-4 py-3">
      <div className="flex items-center gap-3">
        {status === "checking" && (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        )}
        {status === "connected" && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
            <Wifi className="h-5 w-5 text-success" />
          </div>
        )}
        {status === "offline" && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
            <WifiOff className="h-5 w-5 text-destructive" />
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-foreground">
            {status === "connected" && "API Connected"}
            {status === "offline" && "API Offline"}
            {status === "checking" && "Checking connection..."}
          </p>
          <p className="text-xs text-muted-foreground">
            {status === "connected"
              ? "Backend is responding to health checks."
              : status === "offline"
                ? "Backend is not reachable. Start the Python API server."
                : "Verifying backend status..."}
          </p>
        </div>
      </div>
      <button
        onClick={check}
        disabled={status === "checking"}
        className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Retry
      </button>
    </div>
  );
}
