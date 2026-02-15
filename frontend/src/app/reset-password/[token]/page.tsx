"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { Loader2, ArrowLeft, CheckCircle, Lock } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { useRouter, useParams } from "next/navigation"; // Correct import for Next.js 13+ App Router

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams(); // Use useParams hook
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // token from URL
  const token = params.token as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      const res = await api.resetPassword(token, data.password);
      if (res.success) {
        setSuccess(true);
        toast.success("Password reset successfully");
        // Optional: Auto login logic could go here if we stored the token
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        toast.error(res.error || "Failed to reset password");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          {!success && (
            <h1 className="text-3xl font-black text-white tracking-tight">
              Reset Password
            </h1>
          )}
        </div>

        {success ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Password Reset!</h3>
              <p className="text-zinc-400 text-sm">
                Your password has been successfully updated. You can now login
                with your new password.
              </p>
            </div>
            <Link
              href="/login"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800"
          >
            <p className="text-zinc-400 text-center">
              Enter your new password below.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  {...register("password")}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  {...register("confirmPassword")}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
