import { useMemo } from "react";
import { PiggyBank, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import MonthlyChart from "./MonthlyChart";
import CategoryBreakdown from "./CategoryBreakdown";
import StatCard from "./StatCard";

const fmt = (n) => "Rs " + Math.round(n).toLocaleString("en-IN");

const getMonthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export default function AnalyticsPage({ transactions, loading, error }) {
  const selectedMonth = getMonthKey(new Date());
  const monthTx = useMemo(
    () => transactions.filter((t) => t.date?.slice(0, 7) === selectedMonth),
    [transactions, selectedMonth]
  );

  const income = useMemo(
    () => monthTx.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0),
    [monthTx]
  );
  const expenses = useMemo(
    () => monthTx.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
    [monthTx]
  );
  const balance = income - expenses;
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-[#1a1714]">Analytics</h1>
        <p className="text-xs text-[#888780] mt-0.5">Monthly trends and category insights</p>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-[#FBEAF0] px-3 py-2 text-xs text-[#D4537E]">
          {error}
        </p>
      )}
      {loading && (
        <p className="mb-4 rounded-lg bg-white px-3 py-2 text-xs text-[#888780] border border-[#E8E6E0]">
          Loading analytics...
        </p>
      )}

      <div className="grid grid-cols-4 gap-3 mb-4">
        <StatCard
          label="Balance"
          value={fmt(balance)}
          delta="This month"
          positive={balance >= 0}
          icon={<Wallet size={16} className="text-[#534AB7]" />}
          iconBg="bg-[#EEEDFE]"
        />
        <StatCard
          label="Income"
          value={fmt(income)}
          delta={`${monthTx.filter((t) => t.type === "income").length} entries`}
          positive
          valueColor="text-[#27500A]"
          icon={<TrendingDown size={16} className="text-[#3B6D11]" />}
          iconBg="bg-[#EAF3DE]"
        />
        <StatCard
          label="Expenses"
          value={fmt(expenses)}
          delta={`${monthTx.filter((t) => t.type === "expense").length} entries`}
          positive={false}
          valueColor="text-[#72243E]"
          icon={<TrendingUp size={16} className="text-[#993556]" />}
          iconBg="bg-[#FBEAF0]"
        />
        <StatCard
          label="Savings rate"
          value={`${savingsRate}%`}
          delta={savingsRate >= 50 ? "Great month!" : "Keep it up"}
          positive={savingsRate >= 50}
          valueColor="text-[#085041]"
          icon={<PiggyBank size={16} className="text-[#0F6E56]" />}
          iconBg="bg-[#E1F5EE]"
        />
      </div>

      <div className="grid grid-cols-[1.4fr_1fr] gap-4">
        <MonthlyChart transactions={transactions} selectedMonth={selectedMonth} />
        <CategoryBreakdown transactions={transactions} curMonth={selectedMonth} />
      </div>
    </div>
  );
}
