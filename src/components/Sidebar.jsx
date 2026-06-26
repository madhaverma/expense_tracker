import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Clock, BarChart2, Wallet, LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Main" },
  { path: "/transactions", label: "Transactions", icon: Clock, group: "Main" },
  { path: "/analytics", label: "Analytics", icon: BarChart2, group: "Main" },
];

export default function Sidebar({ isLoggedIn, user, onLogout }) {
  const groups = ["Main"];
  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 flex h-16 flex-shrink-0 bg-[#7F77DD] shadow-[0_-8px_24px_rgba(26,23,20,0.12)] md:static md:h-full md:w-52 md:flex-col md:shadow-none">
      {/* Logo */}
      <div className="hidden items-center gap-3 border-b border-white/10 px-5 py-5 md:flex">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
          <Wallet size={18} className="text-white" />
        </div>
        <span className="text-white font-medium text-base">Spendly</span>
      </div>

      {/* Nav */}
      <nav className="flex w-full items-center justify-around px-2 py-2 md:block md:flex-1 md:overflow-y-auto md:px-3 md:py-3">
        {groups.map((group) => (
          <div key={group} className="flex w-full justify-around md:mb-2 md:block">
            <p className="hidden text-[10px] font-medium uppercase tracking-widest text-purple-300 md:block md:px-2 md:py-2">
              {group}
            </p>
            {NAV_ITEMS.filter((i) => i.group === group).map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-colors md:mb-1 md:w-full md:flex-row md:justify-start md:gap-3 md:px-3 md:py-2 md:text-sm ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-purple-200 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={17} className="flex-shrink-0" />
                <span className="max-w-full truncate">{label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="hidden border-t border-white/10 px-4 py-4 md:block">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-purple-300 flex items-center justify-center text-[11px] font-medium text-purple-900 flex-shrink-0">
            {isLoggedIn ? initials || "U" : "G"}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium leading-tight truncate">
              {isLoggedIn ? user?.name || "User" : "Guest"}
            </p>
            <p className="text-purple-300 text-[10px]">
              {isLoggedIn ? "Personal account" : "Not logged in"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </aside>
  );
}
