"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";
import { COMMERCE_CONFIG } from "@/lib/constants";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const { formatPrice } = useSettings();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const shipping = COMMERCE_CONFIG.SHIPPING_COST;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user?.token) {
      toast.error("Please login to complete your purchase");
      router.push("/login?redirect=/checkout");
      return;
    }

    setIsProcessing(true);

    const formData = new FormData(e.target as HTMLFormElement);

    const orderData = {
      orderItems: cartItems.map((item) => ({
        name: item.name,
        qty: item.quantity,
        image: item.image,
        price: item.price,
        product: item._id || item.id,
      })),
      shippingAddress: {
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        postalCode: formData.get("zip") as string,
        country: COMMERCE_CONFIG.DEFAULT_COUNTRY,
      },
      paymentMethod: "Credit Card", // Hardcoded for demo
      itemsPrice: subtotal,
      shippingPrice: shipping,
      taxPrice: 0,
      totalPrice: total,
    };

    try {
      const data = await api.createOrder(orderData, user.token);

      if (data.success || data._id) {
        const orderId = data._id || data.order?._id;

        // Save for success page display
        const localOrderData = {
          id: orderId,
          items: cartItems,
          subtotal,
          shipping,
          total,
          date: new Date().toISOString(),
        };
        localStorage.setItem("lastOrder", JSON.stringify(localOrderData));

        clearCart();
        toast.success("Order placed successfully!");
        router.push(`/order-success?orderId=${orderId}`);
      } else {
        toast.error(data.message || "Failed to create order");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Network error during checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-8 py-12 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
          Your cart is empty
        </h1>
        <p className="text-zinc-500 mb-8 font-medium">
          Add some gear to your cart to proceed to checkout.
        </p>
        <Link
          href="/products"
          className="bg-teal-500 text-black px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-teal-400 transition-all active:scale-95"
        >
          Browse Gear
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 pt-32 md:pt-40 pb-12 min-h-[60vh]">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors font-bold text-xs uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Cart
      </Link>

      <h1 className="text-6xl font-black text-white tracking-tighter uppercase mb-12">
        CHECKOUT
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          {!isAuthenticated && (
            <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl mb-8 flex items-center gap-4">
              <Lock className="w-6 h-6 text-amber-500" />
              <div>
                <p className="text-amber-500 font-bold uppercase text-xs tracking-widest">
                  Authentication Required
                </p>
                <p className="text-zinc-400 text-sm mt-1">
                  You need to be logged in to place an order.{" "}
                  <Link
                    href="/login?redirect=/checkout"
                    className="text-white underline font-bold"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          )}

          <h2 className="text-xl font-black text-white uppercase tracking-tight mb-8">
            Shipping Information
          </h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  defaultValue={user?.name?.split(" ")[0] || ""}
                  required
                  className="w-full px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl focus:outline-none focus:border-teal-500 transition-all text-white font-medium"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  defaultValue={user?.name?.split(" ")[1] || ""}
                  required
                  className="w-full px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl focus:outline-none focus:border-teal-500 transition-all text-white font-medium"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                defaultValue={user?.email || ""}
                required
                className="w-full px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl focus:outline-none focus:border-teal-500 transition-all text-white font-medium"
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
                Shipping Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                className="w-full px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl focus:outline-none focus:border-teal-500 transition-all text-white font-medium"
                placeholder="123 Creator Lane"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  className="w-full px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl focus:outline-none focus:border-teal-500 transition-all text-white font-medium"
                  placeholder="Los Angeles"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
                  ZIP / Postal Code
                </label>
                <input
                  type="text"
                  name="zip"
                  required
                  className="w-full px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl focus:outline-none focus:border-teal-500 transition-all text-white font-medium"
                  placeholder="90001"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-white text-black py-5 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-teal-500 transition-all duration-300 transform hover:-translate-y-1 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isProcessing ? (
                "PROCESSING..."
              ) : (
                <>
                  PLACE SECURE ORDER <CheckCircle className="w-6 h-6" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sticky top-32 shadow-2xl">
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-8">
              Order Summary
            </h2>
            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item._id || item.id} className="flex gap-4 group">
                  <div className="w-20 h-20 bg-zinc-800 rounded-xl overflow-hidden border border-zinc-800 flex-shrink-0 relative group-hover:border-white/20 transition-all">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-white group-hover:text-teal-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-zinc-500 text-xs font-black uppercase mt-1">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="font-black text-white">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800 pt-6 space-y-3">
              <div className="flex justify-between text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                <span>Flat Rate Shipping</span>
                <span className="text-white">{formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-2xl font-black text-white pt-6 border-t border-zinc-800 mt-6 uppercase tracking-tighter">
                <span>Total</span>
                <span className="text-teal-500 font-black">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
