import type { PredictionRecord } from "@/types/transaction";

export const DASHBOARD_STATS = {
  totalTransactions: 10000,
  fraudDetected: 500,
  legitimateTransactions: 9500,
  fraudRate: 5.0,
};

export const TRANSACTION_OVERVIEW = [
  { date: "Jan", total: 820, fraud: 41, legitimate: 779 },
  { date: "Feb", total: 910, fraud: 55, legitimate: 855 },
  { date: "Mar", total: 1040, fraud: 38, legitimate: 1002 },
  { date: "Apr", total: 1180, fraud: 72, legitimate: 1108 },
  { date: "May", total: 1320, fraud: 48, legitimate: 1272 },
  { date: "Jun", total: 1450, fraud: 61, legitimate: 1389 },
  { date: "Jul", total: 1620, fraud: 85, legitimate: 1535 },
  { date: "Aug", total: 1750, fraud: 53, legitimate: 1697 },
  { date: "Sep", total: 1910, fraud: 47, legitimate: 1863 },
];

export const FRAUD_DISTRIBUTION = [
  { name: "Legitimate", value: 9500, color: "hsl(142 71% 45%)" },
  { name: "Fraud", value: 500, color: "hsl(0 72% 51%)" },
];

export const MERCHANT_FRAUD = [
  { category: "Electronics", fraud: 145, total: 1800 },
  { category: "Travel", fraud: 67, total: 900 },
  { category: "Food", fraud: 33, total: 1600 },
  { category: "Clothing", fraud: 41, total: 1300 },
  { category: "Grocery", fraud: 22, total: 1400 },
];

export const RISK_DISTRIBUTION = [
  { name: "Low Risk", value: 8200, color: "hsl(142 71% 45%)" },
  { name: "Medium Risk", value: 1300, color: "hsl(38 92% 50%)" },
  { name: "High Risk", value: 500, color: "hsl(0 72% 51%)" },
];

export const FRAUD_TREND = [
  { date: "Week 1", fraud: 38, legitimate: 780 },
  { date: "Week 2", fraud: 52, legitimate: 810 },
  { date: "Week 3", fraud: 41, legitimate: 845 },
  { date: "Week 4", fraud: 67, legitimate: 890 },
  { date: "Week 5", fraud: 48, legitimate: 920 },
  { date: "Week 6", fraud: 61, legitimate: 950 },
  { date: "Week 7", fraud: 85, legitimate: 980 },
  { date: "Week 8", fraud: 53, legitimate: 1010 },
];

export const PROBABILITY_DISTRIBUTION = [
  { range: "0-10%", count: 4200 },
  { range: "10-20%", count: 2800 },
  { range: "20-30%", count: 1500 },
  { range: "30-40%", count: 700 },
  { range: "40-50%", count: 300 },
  { range: "50-60%", count: 200 },
  { range: "60-70%", count: 180 },
  { range: "70-80%", count: 70 },
  { range: "80-90%", count: 30 },
  { range: "90-100%", count: 20 },
];

export const ANALYTICS_METRICS = {
  totalTransactions: 10000,
  fraudTransactions: 500,
  legitimateTransactions: 9500,
  fraudRate: 5.0,
  averageFraudProbability: 12.4,
};

const CATEGORIES = [
  "Electronics",
  "Travel",
  "Food",
  "Clothing",
  "Grocery",
];

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function generateMockRecords(count: number): PredictionRecord[] {
  const records: PredictionRecord[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const isFraud = Math.random() < 0.12;
    const probability = isFraud
      ? randomInt(72, 98) / 100
      : randomInt(2, 35) / 100;
    const category = randomFrom(CATEGORIES);
    const amount = randomInt(500, 50000);
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(randomInt(0, 23), randomInt(0, 59));

    records.push({
      id: generateId(),
      transaction_id: `TXN-${String(10000 + i).padStart(5, "0")}`,
      date_time: date.toISOString(),
      amount,
      merchant_category: category,
      fraud_probability: probability,
      is_fraud_predicted: isFraud ? 1 : 0,
      risk_level:
        probability >= 0.7
          ? "High Risk"
          : probability >= 0.3
            ? "Medium Risk"
            : "Low Risk",
      input: {
        amount,
        transaction_hour: randomInt(0, 23),
        merchant_category: category,
        foreign_transaction: Math.random() < 0.3 ? 1 : 0,
        location_mismatch: Math.random() < 0.25 ? 1 : 0,
        device_trust_score: randomInt(10, 95),
        velocity_last_24h: randomInt(1, 30),
        cardholder_age: randomInt(18, 75),
      },
    });
  }
  return records;
}

export const MOCK_HISTORY: PredictionRecord[] = generateMockRecords(48);
