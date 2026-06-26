import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";

const EXPENSE_CATS = [
  { name: "Food & Dining", emoji: "🍽", bg: "bg-[#FAEEDA]" },
  { name: "Transport",     emoji: "🚌", bg: "bg-[#E6F1FB]" },
  { name: "Shopping",      emoji: "🛍", bg: "bg-[#EEEDFE]" },
  { name: "Housing",       emoji: "🏠", bg: "bg-[#E1F5EE]" },
  { name: "Health",        emoji: "💊", bg: "bg-[#FBEAF0]" },
  { name: "Entertainment", emoji: "🎬", bg: "bg-[#FBEAF0]" },
  { name: "Utilities",     emoji: "⚡", bg: "bg-[#FAEEDA]" },
  { name: "Other",         emoji: "📌", bg: "bg-[#F1EFE8]" },
];

const INCOME_CATS = [
  { name: "Salary",     emoji: "💼", bg: "bg-[#EAF3DE]" },
  { name: "Freelance",  emoji: "💻", bg: "bg-[#E6F1FB]" },
  { name: "Investment", emoji: "📈", bg: "bg-[#EEEDFE]" },
  { name: "Gift",       emoji: "🎁", bg: "bg-[#FAEEDA]" },
  { name: "Other",      emoji: "📌", bg: "bg-[#F1EFE8]" },
];

const today = new Date().toISOString().slice(0, 10);

export default function AddTransactionModal({ transaction, onClose, onSave }) {
  const [type, setType] = useState("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(today);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!transaction) return;

    setType(transaction.type);
    setDescription(transaction.description);
    setAmount(String(transaction.amount));
    setCategory(transaction.category);
    setDate(transaction.date);
    setNote(transaction.note || "");
  }, [transaction]);

  const cats = type === "expense" ? EXPENSE_CATS : INCOME_CATS;

  const handleSave = async () => {
    if (!description.trim()) { setError("Please enter a description."); return; }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) { setError("Please enter a valid amount."); return; }
    if (!category) { setError("Please select a category."); return; }
    if (!date) { setError("Please select a date."); return; }
    setError("");
    setSaving(true);

    try {
      await onSave({ description: description.trim(), amount: parseFloat(amount), type, category, date, note });
    } catch (err) {
      setError(err.message || "Could not save transaction.");
    } finally {
      setSaving(false);
    }
  };

  const typeTab = (t, label, activeClass) => (
    <button
      onClick={() => { setType(t); setCategory(""); }}
      className={`flex-1 py-2.5 text-sm font-medium transition-colors ${type === t ? activeClass : "text-[#888780] hover:text-[#5F5E5A]"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div className="max-h-[calc(100vh-24px)] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#7F77DD]">
          <h2 className="text-base font-medium text-white">{transaction ? "Edit transaction" : "Add transaction"}</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Type tabs */}
        <div className="flex border-b border-[#E8E6E0] bg-[#F8F7F4]">
          {typeTab("expense", "Expense", "bg-[#FBEAF0] text-[#993556] border-b-2 border-[#D4537E]")}
          {typeTab("income",  "Income",  "bg-[#EAF3DE] text-[#3B6D11] border-b-2 border-[#639922]")}
          {typeTab("transfer","Transfer","border-b-2 border-[#7F77DD] text-[#534AB7]")}
        </div>

        <div className="max-h-[calc(100vh-136px)] space-y-4 overflow-y-auto p-4 sm:p-6">
          {/* Description + Amount */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-medium text-[#888780] uppercase tracking-wide mb-1.5">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Metro pass…"
                className="w-full bg-[#F8F7F4] border border-[#E8E6E0] rounded-lg px-3 py-2 text-sm text-[#1a1714] placeholder-[#B4B2A9] focus:outline-none focus:border-[#7F77DD] focus:ring-1 focus:ring-[#7F77DD]/30"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#888780] uppercase tracking-wide mb-1.5">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                min="0"
                step="1"
                className="w-full bg-[#F8F7F4] border border-[#E8E6E0] rounded-lg px-3 py-2 text-sm font-medium text-[#1a1714] placeholder-[#B4B2A9] focus:outline-none focus:border-[#7F77DD] focus:ring-1 focus:ring-[#7F77DD]/30"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-medium text-[#888780] uppercase tracking-wide mb-2">Category</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {cats.map(({ name, emoji, bg }) => (
                <button
                  key={name}
                  onClick={() => setCategory(name)}
                  className={`${bg} rounded-xl py-2.5 px-1 text-center border-2 transition-colors ${
                    category === name ? "border-[#7F77DD]" : "border-transparent"
                  }`}
                >
                  <span className="block text-xl">{emoji}</span>
                  <span className="block text-[9px] font-medium text-[#5F5E5A] mt-1 truncate px-1">{name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date + Note */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-medium text-[#888780] uppercase tracking-wide mb-1.5">Date</label>
              <input
                type="date"
                value={date}
                max={today}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#F8F7F4] border border-[#E8E6E0] rounded-lg px-3 py-2 text-sm text-[#1a1714] focus:outline-none focus:border-[#7F77DD] focus:ring-1 focus:ring-[#7F77DD]/30"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#888780] uppercase tracking-wide mb-1.5">Note (optional)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note…"
                className="w-full bg-[#F8F7F4] border border-[#E8E6E0] rounded-lg px-3 py-2 text-sm text-[#1a1714] placeholder-[#B4B2A9] focus:outline-none focus:border-[#7F77DD] focus:ring-1 focus:ring-[#7F77DD]/30"
              />
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-xs text-[#D4537E] bg-[#FBEAF0] px-3 py-2 rounded-lg">{error}</p>}

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-[#D3D1C7] bg-white py-2.5 text-sm font-medium text-[#5F5E5A] transition-colors hover:bg-[#F8F7F4]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex flex-[2] items-center justify-center gap-2 rounded-lg bg-[#7F77DD] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#6d65cc] disabled:opacity-70"
            >
              <Check size={15} />
              {saving ? "Saving..." : "Save transaction"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
