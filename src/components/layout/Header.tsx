import { Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PageId } from "./Sidebar";

interface HeaderProps {
  activePage: PageId;
  onOpenMobileNav: () => void;
}

const PAGE_TITLES: Record<PageId, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Fraud Detection Dashboard",
    subtitle: "Monitor credit-card transaction risk using machine learning.",
  },
  analysis: {
    title: "Transaction Fraud Analysis",
    subtitle: "Enter transaction details to calculate fraud probability.",
  },
  history: {
    title: "Prediction History",
    subtitle: "Review past fraud detection predictions and results.",
  },
  analytics: {
    title: "Analytics",
    subtitle: "Deep dive into fraud detection metrics and trends.",
  },
  reports: {
    title: "Fraud Detection Reports",
    subtitle: "Generate and download fraud detection reports.",
  },
  settings: {
    title: "Settings",
    subtitle: "Manage your profile, application, and API settings.",
  },
};

export function Header({ activePage, onOpenMobileNav }: HeaderProps) {
  const { title, subtitle } = PAGE_TITLES[activePage];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onOpenMobileNav}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
          <ShieldCheck className="h-4.5 w-4.5 text-white" />
        </div>
        <span className="text-sm font-bold text-foreground">FraudGuard AI</span>
      </div>
      <div className="hidden flex-col lg:flex">
        <h1 className="text-lg font-semibold leading-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden text-xs text-muted-foreground sm:inline">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </header>
  );
}
