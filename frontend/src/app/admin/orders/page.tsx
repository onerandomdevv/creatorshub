"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Package,
} from "lucide-react";
import { Order, OrderStatus } from "@/types/order";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";
import { toast } from "react-hot-toast";

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  shipped: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  pending: <Clock className="w-3 h-3" />,
  processing: <Package className="w-3 h-3" />,
  shipped: <Truck className="w-3 h-3" />,
  delivered: <CheckCircle className="w-3 h-3" />,
  cancelled: <XCircle className="w-3 h-3" />,
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();
  const { formatPrice } = useSettings();

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.token) {
        try {
          const data = await api.getOrders(user.token);
          if (data.success) {
            setOrders(data.data);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchOrders();
  }, [user]);

  const handleMarkAsDelivered = async (orderId: string) => {
    if (!user?.token) return;
    try {
      const data = await api.updateOrderToDelivered(orderId, user.token);
      if (data.success) {
        toast.success("Order marked as delivered");
        setOrders(
          orders.map((order) =>
            order._id === orderId
              ? { ...order, status: "delivered", isDelivered: true }
              : order,
          ),
        );
      } else {
        toast.error("Failed to update order");
      }
    } catch (error) {
      toast.error("Error updating order status");
    }
  };

  const currentFilteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false) ||
      (order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false);

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const headers = [
      "Order ID",
      "Customer Name",
      "Email",
      "Date",
      "Total",
      "Status",
    ];
    const csvContent = [
      headers.join(","),
      ...currentFilteredOrders.map((order) =>
        [
          order._id,
          `"${order.user?.name || "Unknown"}"`,
          order.user?.email || "No email",
          new Date(order.createdAt).toLocaleDateString(),
          order.totalPrice,
          order.status,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `orders_export_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Orders
          </h1>
          <p className="text-zinc-400 mt-1">
            Track and manage customer orders.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-4 py-3 rounded-xl transition-colors flex items-center gap-2 border border-zinc-800 ${showFilters ? "ring-2 ring-indigo-500" : ""}`}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button
            onClick={handleExport}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            Export Report
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer, or Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Status Filter */}
        {showFilters && (
          <div className="w-full md:w-48 animate-in slide-in-from-top-2 duration-200">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950 text-xs uppercase font-bold text-zinc-500">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {currentFilteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-zinc-800/50 transition-colors group"
                >
                  <td className="px-6 py-4 font-mono text-white font-bold">
                    {order._id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">
                        {order.user?.name || "Unknown User"}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {order.user?.email || "No email"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 font-mono text-white">
                    {formatPrice(order.totalPrice)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyles[order.status]}`}
                    >
                      {statusIcons[order.status]}
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {order.status !== "delivered" && (
                        <button
                          onClick={() => handleMarkAsDelivered(order._id)}
                          title="Mark as Delivered"
                          className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors border border-emerald-500/20"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <Link
                        href={`/order-success?orderId=${order._id}&isAdminView=true`}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {currentFilteredOrders.length === 0 && (
          <div className="p-12 text-center text-zinc-500 space-y-2">
            <p className="text-lg font-bold text-white">No orders found</p>
            <p>Try adjusting your search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
