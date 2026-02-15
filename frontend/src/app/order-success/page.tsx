"use client";

import Link from "next/link";
import {
  CheckCircle,
  ArrowRight,
  Printer,
  Share2,
  Eye,
  X,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CartItem } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

import { Suspense } from "react";

// ... (keep interfaces)
interface OrderItem {
  _id?: string;
  name: string;
  qty: number;
  image: string;
  price: number;
  product: string;
}

interface OrderData {
  _id: string;
  orderItems: OrderItem[];
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  createdAt: string;
}

function OrderSuccessContent() {
  // Get the order ID from the URL query parameters
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  // State to hold the order details retrieved from storage
  const [order, setOrder] = useState<OrderData | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Effect to retrieve order details from local storage on component mount
  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId && user?.token) {
        setLoading(true);
        try {
          const data = await api.getOrderById(orderId, user.token);
          if (data.success) {
            setOrder(data.data);
          } else {
            toast.error("Failed to fetch order details.");
          }
        } catch (error) {
          toast.error("Retrying connection...");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrder();
  }, [orderId, user]);

  // Effect to handle closing the modal when the Escape key is pressed
  useEffect(() => {
    if (showReceipt) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setShowReceipt(false);
        }
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [showReceipt]);

  // Effect to trigger confetti animation on load
  useEffect(() => {
    if (order) {
      const runConfetti = async () => {
        const confetti = (await import("canvas-confetti")).default;
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      };
      runConfetti();
    }
  }, [order]);

  // Function to copy the current page URL to clipboard
  const handleShareReceipt = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        toast.success("Receipt link copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy link");
      });
  };

  // Get isAdminView param to adjust UI for admin viewing
  const isAdminView = searchParams.get("isAdminView") === "true";

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 min-h-[60vh]">
      {/* Screen-only Success Message: Hidden when printing */}
      <div className="flex flex-col items-center justify-center text-center mt-10 print:hidden">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-full mt-4">
          <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {isAdminView ? "Order Details" : "Order Placed Successfully!"}
        </h1>
        <p className="text-gray-600 dark:text-zinc-400 max-w-md text-lg">
          {isAdminView
            ? `Viewing details for Order #${orderId}`
            : "Thank you for your purchase. We've received your order and will send you an email confirmation shortly."}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 print:hidden">
        {isAdminView ? (
          <Link
            href="/admin/orders"
            className="inline-flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-8 py-3 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors font-medium"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Orders
          </Link>
        ) : (
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}

        <button
          onClick={() => {
            if (order) {
              setShowReceipt(true);
            } else {
              window.location.reload();
            }
          }}
          disabled={loading}
          className={`inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full border transition-colors font-medium ${
            order
              ? "border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-900 dark:text-zinc-100 cursor-pointer"
              : "border-gray-200 dark:border-zinc-800 bg-gray-100 dark:bg-zinc-900 text-gray-400 dark:text-zinc-600 cursor-pointer"
          }`}
        >
          <Eye className="w-4 h-4" />
          {loading
            ? "Loading..."
            : order
              ? "View Receipt"
              : "Retry (Network Error)"}
        </button>
      </div>

      {/* Receipt Modal */}
      <AnimatePresence>
        {showReceipt && order && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:static print:bg-transparent print:p-0"
            onClick={() => setShowReceipt(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none print:w-full print:max-w-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                id="receipt"
                className="p-8 space-y-6 max-h-[70vh] overflow-y-auto print:max-h-none print:overflow-visible"
              >
                {/* Receipt Header */}
                <div className="flex justify-between items-start border-b border-gray-100 pb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-black">Receipt</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Order #{order._id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-black">Creators Hub</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  {order.orderItems.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden relative print:hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-black">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.qty}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-black">
                        ${(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-100 pt-6 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>
                      $
                      {(
                        order.totalPrice -
                        order.shippingPrice -
                        order.taxPrice
                      ).toFixed(2)}
                    </span>
                  </div>
                  {order.taxPrice > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>${order.taxPrice.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>${order.shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-black pt-4 border-t border-gray-100">
                    <span>Total</span>
                    <span>${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Print Footer */}
                <div className="hidden print:block text-center text-sm text-gray-500 pt-8">
                  <p>Thank you for shopping with Creators Hub!</p>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 print:hidden">
                <button
                  onClick={() => setShowReceipt(false)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 hover:bg-white transition-colors font-medium text-gray-700"
                >
                  <X className="w-4 h-4" />
                  Close
                </button>
                <button
                  onClick={handleShareReceipt}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 hover:bg-white transition-colors font-medium text-gray-700"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors font-medium"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
