import { Pencil, Plus, Trash2 } from "lucide-react";

const fmt = (n) => "Rs " + Math.round(n).toLocaleString("en-IN");

const fmtDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function TransactionsPage({
  transactions,
  onAddClick,
  onEdit,
  onDelete,
  loading,
  error,
}) {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-medium text-[#1a1714]">Transactions</h1>
          <p className="text-xs text-[#888780] mt-0.5">All income and expenses</p>
        </div>
        <button
          onClick={onAddClick}
          className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#7F77DD] px-3 text-xs font-medium text-white transition-colors hover:bg-[#6d65cc] sm:w-auto"
        >
          <Plus size={14} />
          Add transaction
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-[#FBEAF0] px-3 py-2 text-xs text-[#D4537E]">
          {error}
        </p>
      )}

      <div className="bg-white border border-[#E8E6E0] rounded-xl overflow-hidden">
        <div className="hidden grid-cols-[1.2fr_0.9fr_0.8fr_0.8fr_72px] gap-3 bg-[#F8F7F4] px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-[#888780] md:grid">
          <span>Description</span>
          <span>Category</span>
          <span>Date</span>
          <span className="text-right">Amount</span>
          <span className="text-right">Actions</span>
        </div>

        {loading && (
          <p className="px-4 py-6 text-center text-xs text-[#888780]">Loading transactions...</p>
        )}

        {!loading && transactions.length === 0 && (
          <p className="px-4 py-8 text-center text-xs italic text-[#B4B2A9]">
            No transactions yet
          </p>
        )}

        {!loading && transactions.length > 0 && (
          <div className="divide-y divide-[#F1EFE8]">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="grid gap-2 px-4 py-3 text-xs md:grid-cols-[1.2fr_0.9fr_0.8fr_0.8fr_72px] md:items-center md:gap-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-[#1a1714] truncate">{tx.description}</p>
                  {tx.note && <p className="text-[10px] text-[#B4B2A9] truncate">{tx.note}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] md:contents">
                  <span className="text-[#5F5E5A]">{tx.category}</span>
                  <span className="text-[#888780]">{fmtDate(tx.date)}</span>
                </div>
                <span
                  className={`font-medium md:text-right ${
                    tx.type === "income" ? "text-[#639922]" : "text-[#D4537E]"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}
                  {fmt(tx.amount)}
                </span>
                <div className="flex justify-start gap-1 md:justify-end">
                  <button
                    onClick={() => onEdit(tx)}
                    className="p-1.5 rounded-md text-[#7F77DD] hover:bg-[#EEEDFE] transition-colors"
                    aria-label="Edit transaction"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(tx.id)}
                    className="p-1.5 rounded-md text-[#D4537E] hover:bg-[#FBEAF0] transition-colors"
                    aria-label="Delete transaction"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
