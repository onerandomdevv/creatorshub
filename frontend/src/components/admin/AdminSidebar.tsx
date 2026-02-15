"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  LogOut,
  Tags,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import { motion, AnimatePresence } from "framer-motion";

const ADMIN_MENU = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Tags },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const SidebarContent = (
    <>
      <div className="p-8 border-b border-zinc-900 flex items-center justify-between">
        <Link
          href="/admin"
          onClick={onClose}
          className="flex items-center gap-3 group"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-lg group-hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
            A
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-lg font-black text-white tracking-tighter">
              FOUNDRY
            </span>
            <span className="text-[9px] font-black text-indigo-500 tracking-[0.3em] uppercase">
              Admin
            </span>
          </div>
        </Link>
        {/* Close Button - Mobile Only */}
        <button
          onClick={onClose}
          className="md:hidden p-2 text-zinc-500 hover:text-white"
        >
          <LogOut className="w-5 h-5 rotate-180" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {ADMIN_MENU.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-zinc-500 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-900">
        <button
          onClick={() => {
            toast.success("Signing out...");
            logout("/");
          }}
          className="flex items-center gap-3 px-4 py-3 w-full text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-900 flex-shrink-0 min-h-screen hidden md:flex flex-col sticky top-0 h-screen">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-zinc-950 border-r border-zinc-900 z-[60] flex flex-col md:hidden shadow-2xl"
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
