import type { PredictionRecord } from "@/types/transaction";
import { computeStats } from "@/hooks/useTransactions";
import {
  buildMerchantFraud,
  buildRiskDistribution,
} from "@/lib/dashboardData";
import { buildProbabilityDistribution } from "@/lib/analyticsData";

export type ReportKind = "transactions" | "analytics" | "monthly";

const yesNo = (v: number) => (v === 1 ? "Yes" : "No");
const verdict = (r: PredictionRecord) =>
  r.is_fraud_predicted === 1 ? "Fraud" : "Legitimate";
const pct = (p: number) => `${(p * 100).toFixed(1)}%`;
const formatDateTime = (iso: string) => new Date(iso).toLocaleString("en-GB");

function escapeHtml(value: string | number): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ------------------------------ CSV export ------------------------------ */

function csvCell(value: string | number): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function downloadCsv(records: PredictionRecord[]): void {
  const header = [
    "Transaction ID",
    "Date & Time",
    "Amount",
    "Merchant Category",
    "Transaction Hour",
    "Foreign Transaction",
    "Location Mismatch",
    "Device Trust Score",
    "Transactions Last 24h",
    "Cardholder Age",
    "Fraud Probability (%)",
    "Prediction",
    "Risk Level",
  ];

  const rows = records.map((r) => [
    r.transaction_id,
    formatDateTime(r.date_time),
    r.amount,
    r.merchant_category,
    r.input.transaction_hour,
    yesNo(r.input.foreign_transaction),
    yesNo(r.input.location_mismatch),
    r.input.device_trust_score,
    r.input.velocity_last_24h,
    r.input.cardholder_age,
    (r.fraud_probability * 100).toFixed(1),
    verdict(r),
    r.risk_level,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");

  // The BOM makes Excel read the file as UTF-8
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `fraudguard-predictions-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* ------------------------- Print-ready PDF report ------------------------ */

function table(headers: string[], rows: (string | number)[][]): string {
  const head = headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("");
  const body = rows
    .map(
      (row) =>
        `<tr>${row.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`
    )
    .join("");
  return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

function summaryTable(records: PredictionRecord[]): string {
  const s = computeStats(records);
  return table(
    ["Total", "Fraud", "Legitimate", "Fraud Rate", "Avg Fraud Probability"],
    [
      [
        s.total,
        s.fraud,
        s.legitimate,
        `${s.fraudRate.toFixed(1)}%`,
        `${s.averageProbability.toFixed(1)}%`,
      ],
    ]
  );
}

function transactionsBody(records: PredictionRecord[]): string {
  return `
    <h2>Summary</h2>
    ${summaryTable(records)}
    <h2>Transactions</h2>
    ${table(
      [
        "Transaction ID",
        "Date & Time",
        "Amount (INR)",
        "Category",
        "Fraud Probability",
        "Prediction",
        "Risk Level",
      ],
      records.map((r) => [
        r.transaction_id,
        formatDateTime(r.date_time),
        r.amount.toLocaleString("en-IN"),
        r.merchant_category,
        pct(r.fraud_probability),
        verdict(r),
        r.risk_level,
      ])
    )}`;
}

function analyticsBody(records: PredictionRecord[]): string {
  return `
    <h2>Summary</h2>
    ${summaryTable(records)}
    <h2>Fraud by Merchant Category</h2>
    ${table(
      ["Category", "Transactions", "Fraud", "Fraud Rate"],
      buildMerchantFraud(records).map((m) => [
        m.category,
        m.total,
        m.fraud,
        m.total > 0 ? `${((m.fraud / m.total) * 100).toFixed(1)}%` : "0.0%",
      ])
    )}
    <h2>Risk Level Distribution</h2>
    ${table(
      ["Risk Level", "Transactions"],
      buildRiskDistribution(records).map((d) => [d.name, d.value])
    )}
    <h2>Fraud Probability Distribution</h2>
    ${table(
      ["Probability Range", "Transactions"],
      buildProbabilityDistribution(records).map((b) => [b.range, b.count])
    )}`;
}

function monthlyBody(records: PredictionRecord[]): string {
  const months = new Map<string, PredictionRecord[]>();
  for (const r of records) {
    const d = new Date(r.date_time);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const list = months.get(key) ?? [];
    list.push(r);
    months.set(key, list);
  }

  const rows = Array.from(months.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, list]) => {
      const s = computeStats(list);
      const label = new Date(list[0].date_time).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      });
      return [
        label,
        s.total,
        s.fraud,
        s.legitimate,
        `${s.fraudRate.toFixed(1)}%`,
        `${s.averageProbability.toFixed(1)}%`,
      ];
    });

  return `
    <h2>Overall</h2>
    ${summaryTable(records)}
    <h2>Month by Month</h2>
    ${table(
      [
        "Month",
        "Transactions",
        "Fraud",
        "Legitimate",
        "Fraud Rate",
        "Avg Fraud Probability",
      ],
      rows
    )}`;
}

const TITLES: Record<ReportKind, string> = {
  transactions: "Transaction Report",
  analytics: "Fraud Analytics Report",
  monthly: "Monthly Fraud Summary",
};

function buildReportHtml(
  kind: ReportKind,
  records: PredictionRecord[],
  preparedBy: string
): string {
  const title = TITLES[kind];
  const body =
    kind === "transactions"
      ? transactionsBody(records)
      : kind === "analytics"
        ? analyticsBody(records)
        : monthlyBody(records);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)} - FraudGuard AI</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; color: #0f172a; margin: 32px; }
    h1 { margin: 0; font-size: 24px; }
    h2 { margin: 28px 0 8px; font-size: 16px; border-bottom: 2px solid #0ea5e9; padding-bottom: 4px; }
    .meta { color: #475569; font-size: 12px; margin-top: 4px; }
    .brand { color: #0ea5e9; font-weight: bold; font-size: 13px; letter-spacing: 1px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #0f172a; color: #fff; text-align: left; padding: 6px 8px; }
    td { border-bottom: 1px solid #e2e8f0; padding: 6px 8px; }
    tr:nth-child(even) td { background: #f8fafc; }
    .note { margin-top: 28px; color: #64748b; font-size: 11px; }
    @media print { body { margin: 12mm; } }
  </style>
</head>
<body>
  <div class="brand">FRAUDGUARD AI</div>
  <h1>${escapeHtml(title)}</h1>
  <div class="meta">
    Generated on ${escapeHtml(new Date().toLocaleString("en-GB"))}
    &middot; Prepared for ${escapeHtml(preparedBy)}
    &middot; ${records.length} predictions
  </div>
  ${body}
  <p class="note">
    The Fraud / Legitimate result comes from the trained machine learning model.
    Risk levels (Low / Medium / High) are visual bands of the fraud probability.
  </p>
</body>
</html>`;
}

// Opens the report in a new tab and starts the print dialog,
// where the user can choose "Save as PDF". Returns false if the popup is blocked.
export function openPrintReport(
  kind: ReportKind,
  records: PredictionRecord[],
  preparedBy: string
): boolean {
  const win = window.open("", "_blank");
  if (!win) return false;

  win.document.open();
  win.document.write(buildReportHtml(kind, records, preparedBy));
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 400);
  return true;
}