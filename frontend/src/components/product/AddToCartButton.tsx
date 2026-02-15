"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, Lock } from "lucide-react";
import { Product } from "@/types/product";
import { toast } from "react-hot-toast";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const handleAddToCart = () => {
    if (isAdmin) {
      toast.error("Administrators cannot place orders.");
      return;
    }
    addToCart({ ...product });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdmin}
      className={`w-full md:w-auto flex items-center justify-center gap-2 px-12 py-5 rounded-2xl transition-all active:scale-95 font-black text-xl shadow-2xl overflow-hidden group relative ${
        isAdmin
          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50"
          : "bg-black text-white hover:bg-teal-600"
      }`}
    >
      {!isAdmin && (
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
      {isAdmin ? (
        <Lock className="w-6 h-6" />
      ) : (
        <ShoppingCart className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      )}
      <span className="relative z-10">
        {isAdmin ? "ADMIN MODE" : "ADD TO CART"}
      </span>
    </button>
  );
}
