import { useMemo } from "react";

const CAT_COLORS = {
  "Food & Dining": { dot: "#BA7517", bar: "#FAC775" },
  Transport:       { dot: "#185FA5", bar: "#85B7EB" },
  Shopping:        { dot: "#534AB7", bar: "#AFA9EC" },
  Housing:         { dot: "#0F6E56", bar: "#5DCAA5" },
  Health:          { dot: "#993556", bar: "#ED93B1" },
  Entertainment:   { dot: "#D85A30", bar: "#F0997B" },
  Utilities:       { dot: "#444441", bar: "#B4B2A9" },
  Other:           { dot: "#888780", bar: "#D3D1C7" },
};

const fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

export default function CategoryBreakdown({ transactions, curMonth }) {
  const cats = useMemo(() => {
    const expenses = transactions.filter(
      (t) => t.type === "expense" && t.date.slice(0, 7) === curMonth
    );
    const total = expenses.reduce((s, t) => s + t.amount, 0);
    const map = {};
    expenses.forEach((t) => {
      if (!map[t.category]) map[t.category] = 0;
      map[t.category] += t.amount;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat, amount]) => ({ cat, amount, pct: total ? Math.round((amount / total) * 100) : 0 }));
  }, [transactions, curMonth]);

  return (
    <div className="bg-white border border-[#E8E6E0] rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-medium text-[#1a1714]">Top categories</h2>
        <span className="text-xs text-[#7F77DD] font-medium cursor-pointer">View all</span>
      </div>
      {cats.length === 0 && (
        <p className="text-xs text-[#B4B2A9] italic text-center py-4">No expenses this month</p>
      )}
      <div className="space-y-2">
        {cats.map(({ cat, amount, pct }) => {
          const colors = CAT_COLORS[cat] || { dot: "#888780", bar: "#D3D1C7" };
          return (
            <div key={cat} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: colors.dot }} />
              <span className="text-[11px] text-[#5F5E5A] flex-1 truncate">{cat}</span>
              <div className="flex-[2] h-1.5 bg-[#F1EFE8] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: colors.bar }}
                />
              </div>
              <span className="text-[11px] text-[#888780] min-w-[52px] text-right">{fmt(amount)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
