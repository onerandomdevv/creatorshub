"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import { Suspense } from "react";

// ... (schema and types)
const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(6, "Code must be 6 digits")
    .max(6, "Code must be 6 digits"),
});

type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login: authLogin } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
  });

  const handleResend = async () => {
    if (!email) return;

    setCanResend(false);
    setTimeLeft(60); // Reset timer

    try {
      const res = await api.resendVerification(email);
      if (res.success) {
        toast.success("New verification code sent!");
      } else {
        toast.error(res.error || "Failed to resend code");
        setCanResend(true);
        setTimeLeft(0);
      }
    } catch (error) {
      toast.error("Network error");
      setCanResend(true);
      setTimeLeft(0);
    }
  };

  const onSubmit = async (data: VerifyEmailFormData) => {
    if (!email) {
      toast.error("Email is missing. Please register again.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.verifyEmail(email, data.code);
      if (res.success) {
        toast.success("Email verified successfully!");

        if (res.token && res.user) {
          localStorage.setItem("gmc_token", res.token);
          localStorage.setItem("gmc_user", JSON.stringify(res.user));

          if (res.user.role === "admin") {
            window.location.href = "/admin";
          } else {
            window.location.href = "/dashboard";
          }
        } else {
          router.push("/login");
        }
      } else {
        toast.error(res.error || "Verification failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-white text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Invalid Session</h1>
          <p className="text-zinc-400 mt-2">
            No email address found to verify.
          </p>
          <Link
            href="/register"
            className="text-indigo-500 hover:text-indigo-400 mt-4 inline-block"
          >
            Go to Registration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white tracking-tight">
            Verify Your Email
          </h1>
          <p className="text-zinc-400">
            We've sent a 6-digit verification code to{" "}
            <span className="text-white font-bold">{email}</span>
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">
              Verification Code
            </label>
            <input
              {...register("code")}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 text-center text-2xl tracking-[1em] font-mono text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="000000"
              maxLength={6}
            />
            {errors.code && (
              <p className="text-red-500 text-xs">{errors.code.message}</p>
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
              "Verify Account"
            )}
          </button>
        </form>

        <div className="text-zinc-500 text-sm">
          Didn't receive the code?{" "}
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
            >
              Resend Code
            </button>
          ) : (
            <span className="text-zinc-600">Resend in {timeLeft}s</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
