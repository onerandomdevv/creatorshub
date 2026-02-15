"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Filter,
} from "lucide-react";
import { Product } from "@/types/product";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import { toast } from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { formatPrice } = useSettings();

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const initiateDelete = (id: string) => {
    setProductToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async (password: string) => {
    if (!productToDelete || !user?.token) return;

    setIsDeleting(true);
    try {
      // 1. Verify Password
      const verifyRes = await api.verifyPassword(password, user.token);

      if (verifyRes.success) {
        // 2. Delete Product
        const deleteRes = await api.deleteProduct(productToDelete, user.token);

        if (deleteRes.success || deleteRes.message === "Product removed") {
          // Backend deleteProduct might return { message: "Product removed" } depending on controller
          // Our previous check in api.ts suggested handling res.json()
          // Assuming success if no error thrown, but check response structure if needed.
          // Based on api.ts deleteProduct, it returns res.json().
          // If successful, remove from state.
          setProducts((prev) => prev.filter((p) => p._id !== productToDelete));
          toast.success("Product deleted successfully");
          setDeleteModalOpen(false);
          setProductToDelete(null);
        } else {
          toast.error(deleteRes.message || "Failed to delete product");
        }
      } else {
        toast.error(verifyRes.message || "Invalid password");
        // Don't close modal, let user try again
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Products
          </h1>
          <p className="text-zinc-400 mt-1">
            Manage your catalog, inventory, and pricing.
          </p>
        </div>
        <Link
          href="/admin/products/add"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-700 text-zinc-400 rounded-lg hover:text-white hover:border-zinc-600 transition-colors font-bold text-sm">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950 text-xs uppercase font-bold text-zinc-500">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Brand</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-zinc-800/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center text-xs font-bold text-zinc-600">
                        IMG
                      </div>
                      <div>
                        <div className="font-bold text-white">
                          {product.name}
                        </div>
                        <div className="text-xs text-zinc-500">
                          ID: {product._id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-white">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4">{product.brand}</td>
                  <td className="px-6 py-4 text-center">
                    {product.isFeatured ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        Featured
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-800 text-zinc-500 border border-zinc-700">
                        Standard
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/products/${product._id}/edit`}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() =>
                          initiateDelete(product._id || product.id)
                        }
                        className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination / Empty State */}
        {filteredProducts.length === 0 && (
          <div className="p-12 text-center text-zinc-500 space-y-2">
            <p className="text-lg font-bold text-white">No products found</p>
            <p>Try adjusting your search terms.</p>
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDelete}
        loading={isDeleting}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone. Enter your password to confirm."
      />
    </div>
  );
}
