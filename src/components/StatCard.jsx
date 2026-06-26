export default function StatCard({
  label, value, delta, positive, icon, iconBg, valueColor = "text-[#1a1714]",
}) {
  return (
    <div className="min-w-0 rounded-xl border border-[#E8E6E0] bg-white p-4">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[11px] font-medium text-[#888780] tracking-wide uppercase">
          {label}
        </span>
        <div className={`w-8 h-8 flex-shrink-0 rounded-lg ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className={`break-words text-xl font-medium tracking-tight ${valueColor}`}>{value}</p>
      <p className={`text-[11px] mt-1 ${positive ? "text-[#639922]" : "text-[#D4537E]"}`}>
        {delta}
      </p>
    </div>
  );
}
