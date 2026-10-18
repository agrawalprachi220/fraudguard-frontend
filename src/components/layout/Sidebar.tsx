import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  LayoutDashboard,
  ScanSearch,
  History,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiStatus } from "@/components/common/ApiStatus";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export type PageId =
  | "dashboard"
  | "analysis"
  | "history"
  | "analytics"
  | "reports"
  | "settings";

interface NavItem {
  id: PageId;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "analysis", label: "Transaction Analysis", icon: ScanSearch },
  { id: "history", label: "Prediction History", icon: History },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  onLogout: () => void;
}

export function Sidebar({ activePage, onNavigate, onLogout }: SidebarProps) {
  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card/40 lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-bold tracking-tight text-foreground">
            FraudGuard AI
          </span>
          <span className="text-[11px] text-muted-foreground">
            Fraud Detection
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-4.5 w-4.5 shrink-0",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              />
              {item.label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-border px-3 py-4">
        <ApiStatus compact />
        <Separator />
        <div className="flex items-center gap-3 rounded-lg px-2 py-1">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 leading-tight">
            <p className="text-sm font-medium text-foreground">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@fraudguard.ai</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={onLogout}
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
