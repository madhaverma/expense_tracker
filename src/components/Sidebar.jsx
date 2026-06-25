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
    <aside className="w-52 bg-[#7F77DD] flex flex-col flex-shrink-0 h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
          <Wallet size={18} className="text-white" />
        </div>
        <span className="text-white font-medium text-base">Spendly</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        {groups.map((group) => (
          <div key={group} className="mb-2">
            <p className="text-[10px] font-medium tracking-widest uppercase text-purple-300 px-2 py-2">
              {group}
            </p>
            {NAV_ITEMS.filter((i) => i.group === group).map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium mb-1 transition-colors ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-purple-200 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-white/10">
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
