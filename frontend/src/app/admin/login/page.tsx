"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call real backend login
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        // Redundant check for safety, AuthContext already set the user
        // We'll use a small delay to ensure localstorage is ready
        setTimeout(() => {
          const storedUser = localStorage.getItem("gmc_user");
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.role === "admin") {
              toast.success("Admin Access Granted");
              router.push("/admin");
            } else {
              toast.error("Access Denied: Not an admin account");
              // Logout if not admin but tried to login here
              localStorage.removeItem("gmc_user");
            }
          }
        }, 100);
      } else if (result.requiresVerification) {
        router.push(
          `/verify-email?email=${encodeURIComponent(formData.email)}`,
        );
      }
    } catch (err) {
      toast.error("Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 space-y-2">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-indigo-600/20 mb-6">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Admin Portal
          </h1>
          <p className="text-zinc-500">
            Restricted access for Foundry personnel only.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-2xl"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="email"
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-600"
                  placeholder="admin@foundry.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-600"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-indigo-600/20"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Access Dashboard{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-zinc-600 text-xs">
          Unlawfull access is prohibited and monitored.
        </p>
      </div>
    </div>
  );
}
