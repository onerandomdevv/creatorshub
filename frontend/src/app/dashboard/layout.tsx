"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header Placeholder (would be extracted if this was real prod) */}
        <div className="md:hidden p-4 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between sticky top-0 z-50">
          <span className="font-black text-xl tracking-tighter">DASHBOARD</span>
          <button
            onClick={() => {
              toast.success("Signing out...");
              logout("/");
            }}
            className="p-2 bg-red-500/10 text-red-500 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-12">
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
