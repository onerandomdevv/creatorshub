"use client";

import { Package, Loader2, ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.token) return;
      try {
        const data = await api.getMyOrders(user.token);
        if (data.success) {
          setOrders(data.data || []);
        }
      } catch (err) {
        console.error("Order fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchOrders();
    }
  }, [user, authLoading]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight">
          ORDER HISTORY
        </h1>
        <p className="text-zinc-500">Track and manage your recent purchases.</p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-4 bg-zinc-900 rounded-3xl border border-zinc-800">
            <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
            <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">
              Retrieving Purchase History...
            </p>
          </div>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-700 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center border border-zinc-800 flex-shrink-0 group-hover:border-teal-500/30 transition-colors">
                  <Package className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-black text-lg text-white">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                        order.status === "Processing" ||
                        order.status === "Pending"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-teal-500/10 text-teal-500"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} •
                    Total:{" "}
                    <span className="text-white font-bold">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-xs text-zinc-600 mt-2">
                    Items:{" "}
                    {order.orderItems
                      ?.map((item: any) => item.name)
                      .join(", ") || "No items recorded"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => toast.success("Order Tracking Linked")}
                  className="px-6 py-3 bg-zinc-800 text-white font-bold rounded-xl text-sm hover:bg-zinc-700 transition-colors border border-zinc-700"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-20 text-center space-y-6 bg-zinc-900 rounded-3xl border border-zinc-800">
            <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-10 h-10 text-zinc-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                No Orders Yet
              </h3>
              <p className="text-zinc-500 max-w-xs mx-auto text-sm">
                Your foundry is still awaiting its first shipment. Browse our
                selection to get started.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-block bg-teal-500 text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-teal-400 transition-all active:scale-95"
            >
              Shop Gear
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
