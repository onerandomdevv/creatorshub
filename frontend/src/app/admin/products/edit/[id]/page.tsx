"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import ImageUpload from "@/components/ui/ImageUpload";

// Schema Validation (Same as Add)
const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.coerce.number().min(0, "Price must be positive"),
  category: z.string().min(1, "Category is required"),
  niche: z.string().min(1, "Niche is required"),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().min(10, "Description needed (min 10 chars)"),
  featured: z.boolean().default(false),
  image: z.string().min(1, "Product image is required"),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { user } = useAuth();
  const id = params.id as string;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(productSchema),
  });

  // Fetch Product Data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.getProduct(id);
        // Note: data might be directly the product object depending on backend productController.getProduct
        // productController: res.json(product) -> Direct object
        const product = data;

        if (product) {
          reset({
            name: product.name,
            price: product.price,
            category: product.category,
            niche:
              product.niche && product.niche.length > 0 ? product.niche[0] : "", // Handle array
            brand: product.brand,
            description: product.description,
            featured: product.isFeatured || false,
            image: product.image,
          });
        } else {
          toast.error("Product not found");
          router.push("/admin/products");
        }
      } catch (error) {
        toast.error("Failed to load product");
      } finally {
        setIsFetching(false);
      }
    };

    if (id) fetchProduct();
  }, [id, reset, router]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    if (user?.token) {
      try {
        // Backend expects niche as array if modeled as [String]
        const payload = {
          ...data,
          niche: [data.niche],
          isFeatured: data.featured,
        };
        const res = await api.updateProduct(id, payload, user.token);

        // updateProduct backend: res.json(product).
        // Need to check if it has success property?
        // productController.updateProduct returns res.json(product), NOT {success: true...}
        // It returns the object directly. If error, { error: ... }

        if (res._id) {
          toast.success("Product updated successfully!");
          router.push("/admin/products");
        } else {
          // Error case usually has 'error' or 'message'
          toast.error(res.error || res.message || "Failed to update product");
        }
      } catch (error) {
        toast.error("Failed to update product");
      }
    }
    setIsLoading(false);
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Edit Product
            </h1>
            <p className="text-zinc-400">
              Update product details and landing page settings.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-zinc-800 pb-4">
              Basic Details
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">
                Product Name
              </label>
              <input
                {...register("name")}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. Sony A7IV Camera"
              />
              {errors.name && (
                <p className="text-red-500 text-xs">
                  {(errors.name as any).message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("price")}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-red-500 text-xs">
                    {(errors.price as any).message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">
                  Brand
                </label>
                <input
                  {...register("brand")}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. Sony"
                />
                {errors.brand && (
                  <p className="text-red-500 text-xs">
                    {(errors.brand as any).message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Describe the product features..."
              />
              {errors.description && (
                <p className="text-red-500 text-xs">
                  {(errors.description as any).message}
                </p>
              )}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-zinc-800 pb-4">
              Media
            </h3>
            <div className="space-y-4">
              <ImageUpload
                value={watch("image") || ""}
                onChange={(url) => setValue("image", url)}
              />
              <input type="hidden" {...register("image")} />
              {errors.image && (
                <p className="text-red-500 text-xs">
                  {(errors.image as any).message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-zinc-800 pb-4">
              Organization
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">
                Category
              </label>
              <select
                {...register("category")}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
              >
                <option value="">Select Category</option>
                <option value="Cameras">Cameras</option>
                <option value="Audio">Audio</option>
                <option value="Lighting">Lighting</option>
                <option value="Accessories">Accessories</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs">
                  {(errors.category as any).message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">
                Niche (Landing Page)
              </label>
              <select
                {...register("niche")}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
              >
                <option value="">Select Niche</option>
                <option value="Streaming">Streaming</option>
                <option value="Gaming">Gaming</option>
                <option value="Dancing">Dancing</option>
                <option value="Content Creation">Content Creation</option>
              </select>
              {errors.niche && (
                <p className="text-red-500 text-xs">
                  {(errors.niche as any).message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 p-4 bg-zinc-950 rounded-xl border border-zinc-800 cursor-pointer hover:border-indigo-500 transition-colors">
              <input
                type="checkbox"
                id="featured"
                {...register("featured")}
                className="w-5 h-5 rounded border-zinc-700 text-indigo-600 focus:ring-indigo-500 bg-zinc-900"
              />
              <label
                htmlFor="featured"
                className="font-bold text-white select-none cursor-pointer"
              >
                Featured (Trending)
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Update Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
