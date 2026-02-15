"use client";

import Link from "next/link";
import { ShoppingCart, ArrowRight, Zap } from "lucide-react";
import { useCart, CartItem } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";
import { toast } from "react-hot-toast";

// Helper component for individual cart items to manage local input state
// Helper component for individual cart items to manage local input state
// Separated to prevent re-rendering the entire cart list when editing one item's quantity
function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const { formatPrice } = useSettings();

  // Sync local state if item quantity updates from elsewhere (though rare in this flow)
  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const handleUpdate = () => {
    updateQuantity(item._id || item.id, quantity);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-100 rounded-lg p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
    >
      <div className="flex items-center gap-4 md:gap-6">
        {item.image && (
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.name}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base md:text-lg text-black truncate">
            {item.name}
          </h3>
          <p className="font-bold text-gray-900">{formatPrice(item.price)}</p>
        </div>
        <button
          onClick={() => removeFromCart(item._id || item.id)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Trash2 className="w-5 h-5 text-gray-500 hover:text-red-500" />
        </button>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
        {/* Quantity Input */}
        <div className="flex items-center gap-4">
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            className="w-16 p-2 border border-gray-200 rounded-md text-center text-black focus:outline-none focus:ring-2 focus:ring-black/5"
          />

          {/* Update Button */}
          <button
            onClick={handleUpdate}
            className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-colors active:scale-95 shadow-sm group dark:bg-zinc-800 dark:hover:bg-zinc-700"
            title="Update Quantity"
          >
            <ShoppingCart className="w-5 h-5 text-pink-500 group-hover:text-pink-400 transition-colors" />
          </button>
        </div>

        <div className="text-right min-w-[80px] md:min-w-[100px]">
          <p className="font-black text-lg text-black">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Shopping Cart Page
 *
 * Displays all items currently in the user's cart.
 * - Lists items with update/remove controls.
 * - Calculates and shows the subtotal.
 * - Provides a clear call-to-action for checkout.
 */
export default function CartPage() {
  const { cartItems, clearCart } = useCart();
  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);
  const { formatPrice } = useSettings();

  // Calculate total price dynamically
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const confirmClearCart = () => {
    clearCart();
    setIsClearCartModalOpen(false);
    toast.success("Cart cleared successfully");
  };

  if (cartItems.length === 0) {
    return (
      <main className="max-w-8xl mx-auto px-8 py-12 min-h-[60vh]">
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-black border-b border-gray-100 pb-4 dark:text-white dark:border-zinc-700">
            Your Cart
          </h1>

          <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center bg-gray-50 rounded-lg border border-gray-100 dark:bg-zinc-800 dark:border-zinc-700">
            <div className="bg-white p-4 rounded-full shadow-sm dark:bg-zinc-700">
              <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-zinc-500" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your cart is currently empty
              </h2>
              <p className="text-gray-500 max-w-md mx-auto dark:text-zinc-400">
                Looks like you haven't added anything to your cart yet. Explore
                our products to find the perfect gear for your content creation
                journey.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium active:scale-95 dark:bg-teal-600 dark:hover:bg-teal-700"
            >
              Start Shopping
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-40 pb-12 min-h-[60vh]">
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-zinc-700">
          <h1 className="text-3xl font-black text-black dark:text-white">
            Your Cart
          </h1>
          <button
            onClick={() => setIsClearCartModalOpen(true)}
            className="text-zinc-600 hover:text-red-600 transition-colors text-sm font-bold dark:text-zinc-400 dark:hover:text-red-500"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <CartItemRow key={item._id || item.id} item={item} />
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-3xl p-6 md:p-8 space-y-6 sticky top-24 md:top-32 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xl md:shadow-none">
              <h3 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-teal-500" />
                Order Summary
              </h3>

              <div className="flex items-center justify-between text-lg border-t border-gray-200 pt-4 dark:border-zinc-700">
                <span className="font-semibold text-gray-900 dark:text-zinc-300">
                  Subtotal
                </span>
                <span className="font-bold text-black dark:text-white">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Shipping and taxes calculated at checkout.
              </p>

              <Link
                href="/checkout"
                className="block w-full bg-black text-white py-3 rounded-md font-bold hover:bg-gray-800 transition-colors active:scale-95 text-center dark:bg-teal-600 dark:hover:bg-teal-700"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isClearCartModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-sm w-full space-y-4 shadow-xl dark:bg-zinc-800"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Clear Cart?
            </h3>
            <p className="text-gray-600 dark:text-zinc-400">
              Are you sure you want to remove all items from your cart? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsClearCartModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors font-medium dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearCart}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
              >
                Clear Cart
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
