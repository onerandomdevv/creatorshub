"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Settings {
  storeName: string;
  currency: string;
  supportEmail: string;
  address: string;
  socialMedia: {
    twitter: string;
    whatsapp: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
}

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  formatPrice: (amount: number) => string;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  NGN: "₦",
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.getSettings();
      if (res.success) {
        setSettings(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const formatPrice = (amount: number) => {
    if (!settings) return `$${amount.toFixed(2)}`;

    const symbol = CURRENCY_SYMBOLS[settings.currency] || settings.currency;

    // NGN formatting usually puts symbol before number, same as others.
    // We can use Intl.NumberFormat for better localization eventually.
    return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: fetchSettings,
        formatPrice,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
