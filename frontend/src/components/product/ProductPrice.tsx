"use client";

import { useSettings } from "@/context/SettingsContext";

interface ProductPriceProps {
  basePrice: number;
}

export default function ProductPrice({ basePrice }: ProductPriceProps) {
  const { formatPrice } = useSettings();

  return (
    <div className="flex items-baseline gap-4">
      <p className="text-4xl md:text-5xl font-black text-teal-500 shadow-glow-sm">
        {formatPrice(basePrice)}
      </p>
    </div>
  );
}
