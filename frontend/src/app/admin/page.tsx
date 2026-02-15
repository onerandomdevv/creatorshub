"use client";

import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { useSettings } from "@/context/SettingsContext";

import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

export default function AdminDashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const { formatPrice } = useSettings();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || user?.role !== "admin") {
        router.push("/admin/login");
      }
    }
  }, [isAuthenticated, authLoading, user, router]);

  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    averageOrderValue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!user?.token) return;
      try {
        setLoading(true);
        const [productData, orderData, analyticsData] = await Promise.all([
          api.getProducts(),
          api.getOrders(user.token),
          api.getAnalytics(user.token),
        ]);

        const productsList = productData.success ? productData.data : [];
        const ordersList = orderData.success
          ? orderData.orders || orderData.data || []
          : [];

        const totalRevenue = ordersList.reduce(
          (acc: number, order: any) => acc + (order.totalPrice || 0),
          0,
        );

        setStats({
          revenue: totalRevenue,
          orders: ordersList.length,
          products: productsList.length,
          averageOrderValue:
            ordersList.length > 0 ? totalRevenue / ordersList.length : 0,
        });

        // Sort by date desc
        const sortedOrders = ordersList.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setRecentOrders(sortedOrders.slice(0, 5));

        if (analyticsData) {
          setAnalyticsData(analyticsData);
        }
      } catch (err) {
        console.error("Admin dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [user]);

  const STAT_CARDS = [
    {
      label: "Total Revenue",
      value: loading ? "..." : formatPrice(stats.revenue),
      icon: DollarSign,
      color: "text-emerald-500",
    },
    {
      label: "Total Orders",
      value: loading ? "..." : stats.orders.toString(),
      icon: ShoppingCart,
      color: "text-indigo-500",
    },
    {
      label: "Total Products",
      value: loading ? "..." : stats.products.toString(),
      icon: Package,
      color: "text-amber-500",
    },
    {
      label: "Average Order Value",
      value: loading ? "..." : formatPrice(stats.averageOrderValue),
      icon: TrendingUp,
      color: "text-pink-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">
            ADMIN OVERVIEW
          </h1>
          <p className="text-zinc-500 font-bold text-xs tracking-widest uppercase mt-1">
            Real-time performance monitoring.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_CARDS.map((stat, i) => (
          <AnimatedSection
            key={i}
            delay={i * 0.1}
            className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl group hover:border-teal-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-zinc-800 rounded-xl ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-white mb-1">
              {stat.value}
            </div>
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              {stat.label}
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* Analytics Charts */}
      {analyticsData && (
        <AnimatedSection delay={0.4}>
          <AnalyticsDashboard data={analyticsData} />
        </AnimatedSection>
      )}

      {/* Recent Activity Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-lg font-black text-white uppercase tracking-tighter">
            Recent System Activity
          </h3>
        </div>

        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
            <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">
              Verifying Database Records...
            </p>
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="divide-y divide-zinc-800">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="p-6 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-800 rounded-lg text-teal-500">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">
                      Order #{order._id.slice(-6)}
                    </h4>
                    <p className="text-zinc-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">
                    {formatPrice(order.totalPrice)}
                  </p>
                  <span className="text-[10px] uppercase font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                    Paid
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center space-y-4">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-zinc-600" />
            </div>
            <h4 className="text-white font-bold">No Recent Orders</h4>
            <p className="text-zinc-500 text-sm max-w-sm mx-auto">
              Your platform is clean and ready for real creators. Once users
              start purchasing gear, they will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
