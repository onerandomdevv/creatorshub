"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

const MENU_ITEMS = [
  { name: "Home", href: "/", icon: Home },
  { name: "Shop", href: "/products", icon: ShoppingBag },
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 flex-shrink-0 min-h-screen hidden md:flex flex-col">
      <div className="p-8 border-b border-zinc-800">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-black text-lg group-hover:bg-teal-400 transition-colors">
            C
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-lg font-black text-white tracking-tighter">
              CREATORS
            </span>
            <span className="text-[9px] font-black text-teal-500 tracking-[0.3em] uppercase">
              Hub
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                isActive
                  ? "bg-teal-500 text-black shadow-lg shadow-teal-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={() => {
            toast.success("Signing out...");
            logout("/");
          }}
          className="flex items-center gap-3 px-4 py-3 w-full text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
