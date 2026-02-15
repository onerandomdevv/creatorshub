"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Mail, User, ShoppingBag, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";

interface Customer {
  _id: string;
  name: string;
  email: string;
  orders: number;
  spent: string;
  joinDate: string;
  role: string;
  status: "active" | "inactive";
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();
  const { formatPrice } = useSettings();

  // State for Delete Modal
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    userId: string | null;
    userName: string;
  }>({ isOpen: false, userId: null, userName: "" });
  const [deletePassword, setDeletePassword] = useState("");

  const handleDeleteUser = async () => {
    if (!user?.token || !deleteModal.userId || !deletePassword) return;

    try {
      const res = await api.deleteUser(
        deleteModal.userId,
        deletePassword,
        user.token,
      );
      if (res.success) {
        toast.success("User deleted successfully");
        setCustomers((prev) =>
          prev.filter((c) => c._id !== deleteModal.userId),
        );
        setDeleteModal({ isOpen: false, userId: null, userName: "" });
        setDeletePassword("");
      } else {
        toast.error(res.error || "Failed to delete user");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) return;
      try {
        setLoading(true);
        const [usersData, ordersData] = await Promise.all([
          api.getUsers(user.token),
          api.getOrders(user.token),
        ]);

        const rawUsers = usersData.success ? usersData.users : [];
        const rawOrders = ordersData.success
          ? ordersData.data || ordersData.orders || []
          : [];

        // Map and aggregate data
        const processedCustomers: Customer[] = rawUsers.map((u: any) => {
          // Filter orders for this specific user
          // Note: Check if order.user is an object or ID.
          // Based on previous files, order.user is populated object.
          const userOrders = rawOrders.filter(
            (o: any) => o.user?._id === u._id || o.user === u._id,
          );

          const totalSpent = userOrders.reduce(
            (acc: number, o: any) => acc + (o.totalPrice || 0),
            0,
          );

          return {
            _id: u._id,
            name: u.name,
            email: u.email,
            orders: userOrders.length,
            spent: formatPrice(totalSpent),
            joinDate: u.createdAt
              ? format(new Date(u.createdAt), "MMM dd, yyyy")
              : "N/A",
            role: u.role,
            status: "active", // Defaulting to active as we don't have status in DB yet
          };
        });

        setCustomers(processedCustomers);
      } catch (err) {
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || customer.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Customers
          </h1>
          <p className="text-zinc-400 mt-1">
            Manage your customer base and view their history.
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-4 py-3 rounded-xl transition-colors flex items-center gap-2 border border-zinc-800 ${showFilters ? "ring-2 ring-indigo-500" : ""}`}
        >
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Status Filter */}
        {showFilters && (
          <div className="w-full md:w-48 animate-in slide-in-from-top-2 duration-200">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        )}
      </div>

      {/* Customers Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950 text-xs uppercase font-bold text-zinc-500">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Orders / Spent</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-zinc-500"
                  >
                    Loading customers...
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="hover:bg-zinc-800/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 font-bold">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white">
                            {customer.name}
                          </div>
                          <div className="text-xs text-zinc-500 mb-1">
                            Joined {customer.joinDate}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-600">
                            <Mail className="w-3 h-3" />
                            {customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-bold uppercase ${customer.role === "admin" ? "bg-purple-500/10 text-purple-500" : "bg-zinc-800 text-zinc-400"}`}
                      >
                        {customer.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-bold">
                          {customer.spent}
                        </span>
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3" />
                          {customer.orders} Orders
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          customer.status === "active"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                        }`}
                      >
                        {customer.status.charAt(0).toUpperCase() +
                          customer.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setDeleteModal({
                            isOpen: true,
                            userId: customer._id,
                            userName: customer.name,
                          });
                        }}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredCustomers.length === 0 && (
          <div className="p-12 text-center text-zinc-500 space-y-2">
            <p className="text-lg font-bold text-white">No customers found</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full space-y-6 shadow-2xl">
            <div className="space-y-2 text-center">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500 mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Delete User?</h3>
              <p className="text-zinc-400 text-sm">
                Are you sure you want to delete{" "}
                <span className="font-bold text-white">
                  {deleteModal.userName}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-red-500 transition-colors focus:outline-none"
                  placeholder="Enter your password to confirm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setDeleteModal({
                      isOpen: false,
                      userId: null,
                      userName: "",
                    });
                    setDeletePassword("");
                  }}
                  className="w-full py-3 rounded-xl font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={!deletePassword}
                  className="w-full py-3 rounded-xl font-bold bg-red-600 hover:bg-red-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
