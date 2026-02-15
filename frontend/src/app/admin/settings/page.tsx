"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Loader2, Save, Store, Globe, Users, Shield, Bell } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSettings } from "@/context/SettingsContext";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import TeamManagementModal from "@/components/admin/TeamManagementModal";

// Admin Settings Schema
const storeSettingsSchema = z.object({
  storeName: z.string().min(2, "Store Name must be at least 2 characters"),
  supportEmail: z.string().email("Invalid email address"),
  currency: z.string().min(1, "Currency is required"),
  address: z.string().optional(),
  socialMedia: z.object({
    twitter: z.string().optional(),
    whatsapp: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    youtube: z.string().optional(),
  }),
});

type StoreSettingsData = z.infer<typeof storeSettingsSchema>;

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const { settings, refreshSettings } = useSettings();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StoreSettingsData>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      storeName: "",
      supportEmail: "",
      currency: "USD",
      address: "",
      socialMedia: {
        twitter: "",
        whatsapp: "",
        instagram: "",
        linkedin: "",
        youtube: "",
      },
    },
  });

  useEffect(() => {
    if (settings) {
      setValue("storeName", settings.storeName);
      setValue("supportEmail", settings.supportEmail);
      setValue("currency", settings.currency);
      setValue("address", settings.address || "");
      if (settings.socialMedia) {
        setValue("socialMedia.twitter", settings.socialMedia.twitter || "");
        setValue("socialMedia.whatsapp", settings.socialMedia.whatsapp || "");
        setValue("socialMedia.instagram", settings.socialMedia.instagram || "");
        setValue("socialMedia.linkedin", settings.socialMedia.linkedin || "");
        setValue("socialMedia.youtube", settings.socialMedia.youtube || "");
      }
    }
  }, [settings, setValue]);

  const onSubmit = async (data: StoreSettingsData) => {
    if (!user?.token) return;
    setIsSaving(true);
    try {
      const res = await api.updateSettings(data, user.token);
      if (res.success) {
        await refreshSettings();
        toast.success("Store settings updated successfully!");
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Admin Settings
        </h1>
        <p className="text-zinc-400 mt-1">
          Configure your store and manage team access.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  General Store Settings
                </h2>
                <p className="text-sm text-zinc-500">
                  Basic configuration for your storefront
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">
                    Store Name
                  </label>
                  <input
                    {...register("storeName")}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 transition-colors focus:outline-none"
                  />
                  {errors.storeName && (
                    <p className="text-red-500 text-xs">
                      {errors.storeName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">
                    Support Email
                  </label>
                  <input
                    {...register("supportEmail")}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 transition-colors focus:outline-none"
                  />
                  {errors.supportEmail && (
                    <p className="text-red-500 text-xs">
                      {errors.supportEmail.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">
                  Currency
                </label>
                <select
                  {...register("currency")}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="NGN">NGN (₦)</option>
                </select>
                {errors.currency && (
                  <p className="text-red-500 text-xs">
                    {errors.currency.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">
                  Address
                </label>
                <input
                  {...register("address")}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 transition-colors focus:outline-none"
                  placeholder="123 Creator Blvd..."
                />
              </div>

              <div className="pt-6 border-t border-zinc-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Social Media Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">
                      Twitter (X)
                    </label>
                    <input
                      {...register("socialMedia.twitter")}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 transition-colors focus:outline-none"
                      placeholder="https://x.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">
                      Instagram
                    </label>
                    <input
                      {...register("socialMedia.instagram")}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 transition-colors focus:outline-none"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">
                      WhatsApp
                    </label>
                    <input
                      {...register("socialMedia.whatsapp")}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 transition-colors focus:outline-none"
                      placeholder="https://wa.me/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">
                      YouTube
                    </label>
                    <input
                      {...register("socialMedia.youtube")}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 transition-colors focus:outline-none"
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">
                      LinkedIn
                    </label>
                    <input
                      {...register("socialMedia.linkedin")}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-indigo-500 transition-colors focus:outline-none"
                      placeholder="https://linkedin.com/..."
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-600/20"
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" /> Save Configuration
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 opacity-50 pointer-events-none grayscale">
            <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
              <div className="w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center text-pink-500">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Notifications (Coming Soon)
                </h2>
                <p className="text-sm text-zinc-500">
                  Manage email and SMS alerts
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-zinc-500" />
              Store Preview
            </h3>
            <div className="aspect-video bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden relative group">
              <iframe
                src="/"
                className="w-[400%] h-[400%] transform scale-25 origin-top-left border-none pointer-events-none opacity-50 bg-black group-hover:opacity-100 transition-opacity duration-700"
                tabIndex={-1}
                title="Store Preview"
              />
            </div>
            <Link
              href="/"
              target="_blank"
              className="w-full bg-zinc-800 text-white font-bold py-3 rounded-xl hover:bg-zinc-700 transition-colors text-sm flex items-center justify-center"
            >
              Visit Storefront
            </Link>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-zinc-500" />
              Team Access
            </h3>
            <p className="text-zinc-500 text-sm">
              You are the only active admin.
            </p>
            <div className="flex items-center gap-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                AD
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-bold">Admin User</p>
                <p className="text-zinc-500 text-[10px]">Super Admin</p>
              </div>
              <Shield className="w-4 h-4 text-indigo-500" />
            </div>
            <button
              onClick={() => setIsTeamModalOpen(true)}
              className="w-full bg-zinc-800 text-white font-bold py-3 rounded-xl hover:bg-zinc-700 transition-colors text-sm"
            >
              Manage Team
            </button>
          </div>
        </div>
      </div>

      <TeamManagementModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />
    </div>
  );
}
