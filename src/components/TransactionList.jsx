import { Pencil, Trash2 } from "lucide-react";

const CAT_STYLES = {
  Salary:          { bg: "bg-[#EAF3DE]", color: "text-[#3B6D11]", emoji: "💼" },
  Freelance:       { bg: "bg-[#E6F1FB]", color: "text-[#185FA5]", emoji: "💻" },
  "Food & Dining": { bg: "bg-[#FAEEDA]", color: "text-[#BA7517]", emoji: "🍽" },
  Transport:       { bg: "bg-[#E6F1FB]", color: "text-[#185FA5]", emoji: "🚌" },
  Shopping:        { bg: "bg-[#EEEDFE]", color: "text-[#534AB7]", emoji: "🛍" },
  Housing:         { bg: "bg-[#E1F5EE]", color: "text-[#0F6E56]", emoji: "🏠" },
  Health:          { bg: "bg-[#FBEAF0]", color: "text-[#993556]", emoji: "💊" },
  Entertainment:   { bg: "bg-[#FBEAF0]", color: "text-[#D85A30]", emoji: "🎬" },
  Utilities:       { bg: "bg-[#FAEEDA]", color: "text-[#633806]", emoji: "⚡" },
  Other:           { bg: "bg-[#F1EFE8]", color: "text-[#5F5E5A]", emoji: "📌" },
};

const fmtDate = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

export default function TransactionList({ transactions, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-[#E8E6E0] rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-medium text-[#1a1714]">Recent transactions</h2>
        <span className="text-xs text-[#7F77DD] font-medium cursor-pointer">See all</span>
      </div>
      {transactions.length === 0 && (
        <p className="text-xs text-[#B4B2A9] italic text-center py-4">No transactions yet</p>
      )}
      <div className="divide-y divide-[#F1EFE8]">
        {transactions.map((tx) => {
          const style = CAT_STYLES[tx.category] || CAT_STYLES["Other"];
          return (
            <div key={tx.id} className="flex items-center gap-3 py-2 group">
              <div className={`w-8 h-8 rounded-full ${style.bg} flex items-center justify-center text-base flex-shrink-0`}>
                {style.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#1a1714] truncate">{tx.description}</p>
                <p className="text-[10px] text-[#B4B2A9]">{tx.category}</p>
              </div>
              <span className={`text-xs font-medium ${tx.type === "income" ? "text-[#639922]" : "text-[#D4537E]"}`}>
                {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
              </span>
              <span className="text-[10px] text-[#B4B2A9] min-w-[40px] text-right">{fmtDate(tx.date)}</span>
              <button
                onClick={() => onEdit(tx)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-[#7F77DD] p-1 rounded"
                aria-label="Edit transaction"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => onDelete(tx.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4537E] p-1 rounded"
                aria-label="Delete transaction"
              >
                <Trash2 size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
