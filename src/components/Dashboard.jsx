import { useMemo, useState } from "react";
import {
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
} from "lucide-react";
import StatCard from "./StatCard";
import MonthlyChart from "./MonthlyChart";
import CategoryBreakdown from "./CategoryBreakdown";
import TransactionList from "./TransactionList";

const fmt = (n) =>
  "₹" + Math.round(n).toLocaleString("en-IN");

const getMonthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export default function Dashboard({ transactions, onAddClick, onEdit, onDelete, loading, error }) {
  const currentMonth = getMonthKey(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const curMonth = selectedMonth;

  const monthTx = useMemo(
    () => transactions.filter((t) => t.date?.slice(0, 7) === curMonth),
    [transactions, curMonth]
  );

  const income = useMemo(
    () => monthTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
    [monthTx]
  );
  const expenses = useMemo(
    () => monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    [monthTx]
  );
  const balance = income - expenses;
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

  const monthLabel = new Date(`${selectedMonth}-01T00:00:00`).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
  const isCurrentMonth = selectedMonth === currentMonth;

  const shiftMonth = (offset) => {
    const date = new Date(`${selectedMonth}-01T00:00:00`);
    date.setMonth(date.getMonth() + offset);
    const nextMonth = date.toISOString().slice(0, 7);

    if (nextMonth <= currentMonth) {
      setSelectedMonth(nextMonth);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-lg font-medium text-[#1a1714]">Dashboard</h1>
          <p className="text-xs text-[#888780] mt-0.5">{monthLabel}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <div className="flex w-full items-center overflow-hidden rounded-lg border border-[#D3D1C7] bg-white sm:w-auto">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-[#5F5E5A] transition-colors hover:bg-[#F8F7F4]"
              aria-label="Previous month"
            >
              <ChevronLeft size={14} />
            </button>
            <label className="flex h-9 min-w-0 flex-1 items-center gap-1.5 border-x border-[#E8E6E0] px-2 text-xs font-medium text-[#5F5E5A] sm:flex-none">
              <Calendar size={14} />
              <input
                type="month"
                value={selectedMonth}
                max={currentMonth}
                onChange={(e) => setSelectedMonth(e.target.value || currentMonth)}
                className="min-w-0 flex-1 bg-transparent text-xs font-medium text-[#5F5E5A] focus:outline-none sm:w-[116px]"
                aria-label="Select month"
              />
            </label>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              disabled={isCurrentMonth}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-[#5F5E5A] transition-colors hover:bg-[#F8F7F4] disabled:opacity-35 disabled:hover:bg-white"
              aria-label="Next month"
            >
              <ChevronRight size={14} />
            </button>
          </div>
          {!isCurrentMonth && (
            <button
              type="button"
              onClick={() => setSelectedMonth(currentMonth)}
              className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#D3D1C7] bg-white px-3 text-xs font-medium text-[#5F5E5A] transition-colors hover:bg-[#F8F7F4]"
            >
              This month
            </button>
          )}
          <button
            onClick={onAddClick}
            className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#7F77DD] px-3 text-xs font-medium text-white transition-colors hover:bg-[#6d65cc]"
          >
            <Plus size={14} />
            Add transaction
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-[#FBEAF0] px-3 py-2 text-xs text-[#D4537E]">
          {error}
        </p>
      )}
      {loading && (
        <p className="mb-4 rounded-lg bg-white px-3 py-2 text-xs text-[#888780] border border-[#E8E6E0]">
          Loading transactions...
        </p>
      )}

      {/* Stat cards */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Balance"
          value={fmt(balance)}
          delta={`${savingsRate}% savings rate`}
          positive
          icon={<Wallet size={16} className="text-[#534AB7]" />}
          iconBg="bg-[#EEEDFE]"
        />
        <StatCard
          label="Income"
          value={fmt(income)}
          delta="This month"
          positive
          valueColor="text-[#27500A]"
          icon={<TrendingDown size={16} className="text-[#3B6D11]" />}
          iconBg="bg-[#EAF3DE]"
        />
        <StatCard
          label="Expenses"
          value={fmt(expenses)}
          delta={`${monthTx.filter((t) => t.type === "expense").length} transactions`}
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

      {/* Bottom grid */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <MonthlyChart transactions={transactions} selectedMonth={selectedMonth} />
        <div className="flex flex-col gap-4">
          <CategoryBreakdown transactions={transactions} curMonth={curMonth} />
          <TransactionList
            transactions={monthTx.slice(0, 5)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
}
