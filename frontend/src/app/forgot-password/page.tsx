"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const res = await api.forgotPassword(data.email);
      if (res.success) {
        setEmailSent(true);
        toast.success("Reset link sent to your email");
      } else {
        toast.error(res.error || "Failed to send reset link");
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
          <Link
            href="/login"
            className="inline-flex items-center text-zinc-400 hover:text-white transition-colors text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Forgot Password?
          </h1>
          <p className="text-zinc-400">
            Enter your email and we'll send you instructions to reset your
            password.
          </p>
        </div>

        {emailSent ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto text-indigo-500">
              <Mail className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Check your email</h3>
              <p className="text-zinc-400 text-sm">
                We have sent a password reset link to your email address.
              </p>
            </div>
            <button
              onClick={() => setEmailSent(false)}
              className="text-indigo-400 hover:text-indigo-300 text-sm font-bold"
            >
              Didn't receive the email? Click to resend
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">
                Email Address
              </label>
              <input
                {...register("email")}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="name@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
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
                "Send Reset Link"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
