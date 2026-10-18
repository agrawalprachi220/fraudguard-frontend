import {
  ShieldCheck,
  LayoutDashboard,
  ScanSearch,
  History,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ApiStatus } from "@/components/common/ApiStatus";
import type { PageId } from "./Sidebar";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  onLogout: () => void;
}

const NAV_ITEMS: { id: PageId; label: string; icon: typeof LayoutDashboard }[] =
  [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "analysis", label: "Transaction Analysis", icon: ScanSearch },
    { id: "history", label: "Prediction History", icon: History },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

export function MobileNav({
  open,
  onOpenChange,
  activePage,
  onNavigate,
  onLogout,
}: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 border-r border-border p-0">
        <SheetHeader className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <SheetTitle className="text-base font-bold">
                FraudGuard AI
              </SheetTitle>
            </div>
          </div>
        </SheetHeader>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onOpenChange(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="space-y-3 border-t border-border px-3 py-4">
          <ApiStatus compact />
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-4.5 w-4.5" />
            Logout
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
