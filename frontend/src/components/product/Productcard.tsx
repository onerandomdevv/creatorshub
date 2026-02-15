"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Plus, Pencil } from "lucide-react";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext"; // Import Settings
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  mode?: "view" | "cart";
}

export default function ProductCard(product: any) {
  const { id, _id, name, price, image } = product;
  const productId = _id || id;
  const router = useRouter();
  const { addToCart } = useCart();
  const { formatPrice } = useSettings();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // Ensure image has a slash if it's a local file
  const imageSrc =
    image?.startsWith("http") || image?.startsWith("/") ? image : `/${image}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4 }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300"
    >
      {/* Clickable product card */}
      <Link href={`/products/${productId}`} className="block cursor-pointer">
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 group">
          {/* Admin Edit Shortcut */}
          {isAdmin && (
            <Link
              href={`/admin/products/edit/${id}`}
              className="absolute top-3 right-3 z-30 p-2 bg-black/50 hover:bg-black text-white rounded-full backdrop-blur-sm transition-all"
              title="Edit Product"
            >
              <Pencil size={14} />
            </Link>
          )}

          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />

          {/* Quick Add Overlay - Hidden for Admins */}
          {!isAdmin && (
            <div className="absolute bottom-4 right-4 md:translate-y-12 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addToCart({
                    ...product,
                    id: productId,
                    brand: product.brand || "FOUNDRY PRO",
                    niches: product.niche || product.niches || [],
                  });
                }}
                className="bg-black text-white p-3 rounded-full shadow-lg hover:bg-teal-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div className="p-5 space-y-1">
          <div className="flex justify-between items-center">
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">
              Creator Gear
            </p>
          </div>
          <h3 className="text-lg font-bold text-black group-hover:text-teal-600 transition-colors truncate">
            {name}
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-black text-black">
              {formatPrice(price)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
