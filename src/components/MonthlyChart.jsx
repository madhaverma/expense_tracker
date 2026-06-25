import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const getMonthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export default function MonthlyChart({ transactions, selectedMonth }) {
  const data = useMemo(() => {
    const months = [];
    const [year, month] = selectedMonth.split("-").map(Number);

    for (let i = 5; i >= 0; i--) {
      const date = new Date(year, month - 1 - i, 1);
      const key = getMonthKey(date);
      const label = date.toLocaleDateString("en-IN", { month: "short" });
      const group = transactions.filter((t) => t.date?.slice(0, 7) === key);

      months.push({
        month: label,
        Income: Math.round(
          group
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0)
        ),
        Expenses: Math.round(
          group
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0)
        ),
      });
    }

    return months;
  }, [transactions, selectedMonth]);

  const hasData = data.some((item) => item.Income > 0 || item.Expenses > 0);
  const fmtY = (value) =>
    value >= 1000 ? `Rs ${Math.round(value / 1000)}K` : `Rs ${value}`;

  return (
    <div className="bg-white border border-[#E8E6E0] rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-medium text-[#1a1714]">Monthly overview</h2>
        <span className="text-xs text-[#7F77DD] font-medium">6 months</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barCategoryGap="30%" barGap={3}>
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#B4B2A9" }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={fmtY} tick={{ fontSize: 10, fill: "#B4B2A9" }} axisLine={false} tickLine={false} width={48} />
          <Tooltip
            formatter={(value, name) => [`Rs ${value.toLocaleString("en-IN")}`, name]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "0.5px solid #E8E6E0" }}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#888780" }} />
          <Bar dataKey="Income" fill="#97C459" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Expenses" fill="#ED93B1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      {!hasData && (
        <p className="mt-2 text-center text-xs italic text-[#B4B2A9]">
          No transactions in this 6 month range
        </p>
      )}
    </div>
  );
}
