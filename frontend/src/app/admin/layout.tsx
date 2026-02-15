"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { Search, Bell, User, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Allow access to login page without checks
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isClient) return;

    if (!isLoginPage) {
      if (!isAuthenticated || user?.role !== "admin") {
        router.push("/admin/login");
      }
    } else {
      // If on login page but already admin, go to dashboard
      if (isAuthenticated && user?.role === "admin") {
        router.push("/admin");
      }
    }
  }, [isAuthenticated, user, router, isLoginPage, isClient]);

  // Prevent flash of content
  if (!isClient) return null;

  // Render Login Page without Layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state for protected routes
  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Header */}
        <header className="h-20 border-b border-zinc-900 flex items-center justify-between px-4 md:px-8 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-zinc-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold hidden md:block text-zinc-400">
              Dashboard
            </h2>
            <div className="relative max-w-md w-full hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button className="relative text-zinc-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 md:gap-3 pl-3 md:pl-6 border-l border-zinc-900">
              <button
                onClick={() => {
                  logout("/");
                }}
                className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-900 rounded-lg transition-all"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-white">
                  {user?.name || "Admin"}
                </div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                  Super Admin
                </div>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
                <User className="w-5 h-5 text-zinc-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
