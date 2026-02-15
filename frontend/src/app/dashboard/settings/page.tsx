"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Loader2, Save, User, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

// Profile Schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

// Password Schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "John Doe",
      email: user?.email || "john@example.com",
    },
  });

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    if (!user?.token) {
      toast.error("Please log in to update your profile");
      return;
    }

    setIsProfileLoading(true);
    try {
      const response = await api.updateProfile(
        { name: data.name, email: data.email },
        user.token,
      );

      if (response.success) {
        // Update localStorage with new user data
        const updatedUser = { ...response.user, token: response.token };
        localStorage.setItem("gmc_user", JSON.stringify(updatedUser));
        toast.success("Profile updated successfully!");
        // Optionally trigger a page refresh to update AuthContext
        window.location.reload();
      } else {
        toast.error(response.error || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Network error during profile update");
    } finally {
      setIsProfileLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    if (!user?.token) {
      toast.error("Please log in to update your password");
      return;
    }

    setIsPasswordLoading(true);
    try {
      const response = await api.updateProfile(
        {
          password: data.newPassword,
          currentPassword: data.currentPassword,
        },
        user.token,
      );

      if (response.success) {
        toast.success("Password changed successfully!");
        resetPassword();
      } else {
        toast.error(response.error || "Failed to update password");
      }
    } catch (err) {
      toast.error("Network error during password update");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Settings
        </h1>
        <p className="text-zinc-400 mt-1">Manage your account preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Details */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
            <div className="w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center text-teal-500">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Profile Details</h2>
              <p className="text-sm text-zinc-500">
                Update your personal information
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmitProfile(onProfileSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">
                Full Name
              </label>
              <input
                {...registerProfile("name")}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-teal-500 transition-colors focus:outline-none"
              />
              {profileErrors.name && (
                <p className="text-red-500 text-xs">
                  {profileErrors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">
                Email Address
              </label>
              <input
                {...registerProfile("email")}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-teal-500 transition-colors focus:outline-none"
              />
              {profileErrors.email && (
                <p className="text-red-500 text-xs">
                  {profileErrors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isProfileLoading}
              className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-teal-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProfileLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" /> Save Changes
                </>
              )}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
            <div className="w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center text-teal-500">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Security</h2>
              <p className="text-sm text-zinc-500">Update your password</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmitPassword(onPasswordSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...registerPassword("currentPassword")}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-teal-500 transition-colors focus:outline-none"
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
              {passwordErrors.currentPassword && (
                <p className="text-red-500 text-xs">
                  {passwordErrors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...registerPassword("newPassword")}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-teal-500 transition-colors focus:outline-none"
                />
              </div>
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-xs">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...registerPassword("confirmPassword")}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-teal-500 transition-colors focus:outline-none"
                />
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-xs">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPasswordLoading}
              className="w-full bg-zinc-800 text-white font-bold py-4 rounded-xl hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 border border-zinc-700"
            >
              {isPasswordLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
