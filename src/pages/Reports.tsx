import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  ShieldAlert,
  CalendarDays,
  Download,
  FileBarChart,
  Printer,
  type LucideIcon,
} from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/hooks/useAuth";
import {
  downloadCsv,
  openPrintReport,
  type ReportKind,
} from "@/lib/reportUtils";

interface ReportCardProps {
  kind: ReportKind;
  icon: LucideIcon;
  title: string;
  description: string;
  accent: "primary" | "destructive" | "warning";
}

const REPORTS: ReportCardProps[] = [
  {
    kind: "transactions",
    icon: FileText,
    title: "Transaction Report",
    description:
      "Every analyzed transaction with its fraud probability, prediction and risk level.",
    accent: "primary",
  },
  {
    kind: "analytics",
    icon: ShieldAlert,
    title: "Fraud Analytics Report",
    description:
      "Fraud by merchant category, risk level distribution and probability histogram.",
    accent: "destructive",
  },
  {
    kind: "monthly",
    icon: CalendarDays,
    title: "Monthly Fraud Summary",
    description:
      "Month by month totals, fraud rate and average fraud probability.",
    accent: "warning",
  },
];

const accentClasses = {
  primary: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    btn: "bg-gradient-to-r from-primary to-accent text-white",
  },
  destructive: {
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    btn: "bg-gradient-to-r from-destructive to-destructive/80 text-white",
  },
  warning: {
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    btn: "bg-gradient-to-r from-warning to-warning/80 text-white",
  },
};

export function Reports() {
  const { records, loading } = useTransactions();
  const { displayName } = useAuth();
  const [message, setMessage] = useState<string | null>(null);

  const hasData = records.length > 0;

  function handleGenerate(kind: ReportKind) {
    setMessage(null);
    const opened = openPrintReport(kind, records, displayName);
    if (!opened) {
      setMessage(
        "The report window was blocked by your browser. Allow pop-ups for this site and try again."
      );
    }
  }

  function handleCsv() {
    setMessage(null);
    downloadCsv(records);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-lg border border-border bg-card/40 px-4 py-3">
        <FileBarChart className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm text-muted-foreground">
          Reports are built from your saved prediction history. Click Generate
          PDF, then choose Save as PDF in the print window.
        </p>
      </div>

      {message && (
        <p className="text-sm text-destructive" role="alert">
          {message}
        </p>
      )}

      {!loading && !hasData && (
        <p className="text-sm text-muted-foreground">
          No predictions yet. Analyze a transaction first, then come back to
          generate a report.
        </p>
      )}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
            ))
          : REPORTS.map((report) => {
              const Icon = report.icon;
              const accent = accentClasses[report.accent];
              return (
                <Card
                  key={report.kind}
                  className="glass-card flex flex-col border-border p-6 transition-all hover:-translate-y-0.5"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent.iconBg}`}
                  >
                    <Icon className={`h-6 w-6 ${accent.iconColor}`} />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    {report.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-sm text-muted-foreground">
                    {report.description}
                  </p>
                  <div className="mt-5">
                    <Button
                      className={`w-full ${accent.btn}`}
                      size="sm"
                      disabled={!hasData}
                      onClick={() => handleGenerate(report.kind)}
                    >
                      <Printer className="mr-2 h-4 w-4" />
                      Generate PDF
                    </Button>
                  </div>
                </Card>
              );
            })}
      </div>

      <Card className="glass-card border-border p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Export Data
            </h3>
            <p className="text-sm text-muted-foreground">
              Download all your predictions as a CSV file that opens in Excel.
            </p>
          </div>
          <Button
            variant="outline"
            disabled={!hasData}
            onClick={handleCsv}
          >
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
        </div>
      </Card>
    </div>
  );
}