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
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium text-[#1a1714]">Dashboard</h1>
          <p className="text-xs text-[#888780] mt-0.5">{monthLabel}</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center rounded-lg border border-[#D3D1C7] bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              className="h-8 w-8 flex items-center justify-center text-[#5F5E5A] hover:bg-[#F8F7F4] transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={14} />
            </button>
            <label className="h-8 flex items-center gap-1.5 px-2 border-x border-[#E8E6E0] text-xs font-medium text-[#5F5E5A]">
              <Calendar size={14} />
              <input
                type="month"
                value={selectedMonth}
                max={currentMonth}
                onChange={(e) => setSelectedMonth(e.target.value || currentMonth)}
                className="w-[116px] bg-transparent text-xs font-medium text-[#5F5E5A] focus:outline-none"
                aria-label="Select month"
              />
            </label>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              disabled={isCurrentMonth}
              className="h-8 w-8 flex items-center justify-center text-[#5F5E5A] hover:bg-[#F8F7F4] disabled:opacity-35 disabled:hover:bg-white transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={14} />
            </button>
          </div>
          {!isCurrentMonth && (
            <button
              type="button"
              onClick={() => setSelectedMonth(currentMonth)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-[#D3D1C7] bg-white text-[#5F5E5A] hover:bg-[#F8F7F4] transition-colors"
            >
              This month
            </button>
          )}
          <button
            onClick={onAddClick}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#7F77DD] text-white hover:bg-[#6d65cc] transition-colors"
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
      <div className="grid grid-cols-4 gap-3 mb-4">
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
      <div className="grid grid-cols-2 gap-4">
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
