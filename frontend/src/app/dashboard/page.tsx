"use client";

import { Package, ShoppingCart, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.token) {
        try {
          const data = await api.getMyOrders(user.token);
          if (data.success) {
            setOrders(data.data || []);
          }
        } catch (err) {
          console.error("Error fetching orders:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const totalSpent = orders.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0,
  );
  const pendingOrders = orders.filter((o) => !o.isPaid).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight">
          OVERVIEW
        </h1>
        <p className="text-zinc-500 uppercase font-black tracking-widest text-xs">
          Welcome back, {user?.name || "Member"}.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Orders",
            value: loading ? "..." : orders.length.toString(),
            icon: Package,
          },
          {
            label: "Pending",
            value: loading ? "..." : pendingOrders.toString(),
            icon: Clock,
          },
          {
            label: "Total Spent",
            value: loading ? "..." : `$${totalSpent.toLocaleString()}`,
            icon: ShoppingCart,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-wider">
                {stat.label}
              </span>
              <stat.icon className="w-5 h-5 text-teal-500" />
            </div>
            <p className="text-3xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white uppercase tracking-tighter">
            Recent Orders
          </h2>
          <Link
            href="/dashboard/orders"
            className="text-xs font-black text-teal-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
            <p className="text-zinc-500 font-bold text-xs">SYNCING ORDERS...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="divide-y divide-zinc-800">
            {orders.slice(0, 5).map((order) => (
              <Link
                key={order._id}
                href="/dashboard/orders"
                className="block p-6 hover:bg-zinc-800/50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide ${
                        order.isPaid
                          ? "bg-teal-500/10 text-teal-500"
                          : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center space-y-4">
            <p className="text-zinc-500 font-medium">No orders found yet.</p>
            <Link
              href="/products"
              className="inline-block text-teal-500 font-bold text-sm hover:underline"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
