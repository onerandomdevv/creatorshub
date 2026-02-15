"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";

import { Loader2, Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

// Validation Schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    // Call real backend login
    const result = await login({
      email: data.email,
      password: data.password,
    });

    if (result.success) {
      // Redirect will be handled by the role check in the next step
      // But we can do it here explicitly based on user role from localStorage/context
      const storedUser = localStorage.getItem("gmc_user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } else if (result.requiresVerification) {
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-4xl font-black text-white tracking-tight">
          Welcome Back
        </h2>
        <p className="text-zinc-500">
          Enter your credentials to access your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-xs font-bold text-zinc-500 uppercase tracking-wider"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                {...register("email")}
                id="email"
                type="email"
                placeholder="name@example.com"
                className={`w-full bg-zinc-900 border ${
                  errors.email ? "border-red-500" : "border-zinc-800"
                } rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs font-medium pl-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-bold text-zinc-500 uppercase tracking-wider"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-teal-500 hover:text-teal-400 transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full bg-zinc-900 border ${
                  errors.password ? "border-red-500" : "border-zinc-800"
                } rounded-xl py-4 pl-12 pr-12 text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all`}
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
            {errors.password && (
              <p className="text-red-500 text-xs font-medium pl-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white text-black font-black text-lg py-4 rounded-xl hover:bg-teal-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              SIGN IN{" "}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black px-4 text-zinc-500 font-bold tracking-widest">
            Or
          </span>
        </div>
      </div>

      <p className="text-center text-zinc-500 text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-white font-bold hover:text-teal-500 transition-colors"
        >
          Create Account
        </Link>
      </p>
    </div>
  );
}
