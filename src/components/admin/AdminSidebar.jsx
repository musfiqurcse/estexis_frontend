import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Newspaper,
  BarChart2,
  Settings,
  LogOut,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { useAdminAuth } from "./AdminAuthContext";

const navLinks = [
  { to: "/private/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/private/admin/users", label: "User Management", icon: UserCog },
  { to: "/private/admin/kyc", label: "KYC Reviews", icon: ShieldCheck },
  { to: "/private/admin/listings", label: "Listings", icon: Building2 },
  { to: "#inquiries", label: "Inquiries", icon: FileText },
  { to: "/private/admin/blog", label: "Blog Content", icon: Newspaper },
  { to: "#analytics", label: "Analytics", icon: BarChart2 },
  { to: "#settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ isOpen, onClose }) {
  const { logout, user } = useAdminAuth();
  const location = useLocation();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex w-60 flex-col bg-white border-r border-gray-100 transition-transform duration-200 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-16 items-center px-5 border-b border-gray-100">
        <span className="text-xs font-semibold tracking-widest uppercase text-gray-300">
          grihoo
        </span>
        <span className="ml-1.5 text-xs font-semibold tracking-widest uppercase text-gray-800">
          admin
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navLinks.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          const className = `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive
              ? "bg-gray-900 text-white"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`;

          if (to.startsWith("#")) {
            return (
              <a key={label} href={to} onClick={onClose} className={className}>
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
              </a>
            );
          }

          return (
            <Link key={label} to={to} onClick={onClose} className={className}>
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#164b3f] text-xs font-semibold text-white flex-shrink-0">
            A
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Admin</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || "grihoo.com"}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
