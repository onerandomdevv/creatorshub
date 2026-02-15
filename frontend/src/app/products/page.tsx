"use client";

import ProductCard from "@/components/product/Productcard";
import { api } from "@/lib/api";
import { Product } from "@/types/product";
import { useState, useMemo, useEffect } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Search, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/product/Productgrid";
import ProductSkeleton from "@/components/product/ProductSkeleton";
import { useSettings } from "@/context/SettingsContext";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const { settings } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  // Fetch products from real backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getProducts();
        if (data.success) {
          setProducts(data.data);
        } else {
          setError("Failed to fetch products");
        }
      } catch (err) {
        setError("Network error. Is the server running?");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Sync state with URL params on mount
  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const categories = useMemo(() => {
    return ["All", ...new Set(products.map((p) => p.category))];
  }, [products]);

  // Get currency symbol from settings
  const currencySymbol = useMemo(() => {
    const CURRENCY_SYMBOLS: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      NGN: "₦",
    };
    return settings?.currency
      ? CURRENCY_SYMBOLS[settings.currency] || settings.currency
      : "$";
  }, [settings]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const price = product.price;
      const min = priceRange.min ? parseFloat(priceRange.min) : 0;
      const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
      const matchesPrice = price >= min && price <= max;

      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [products, selectedCategory, searchQuery, priceRange]);

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="space-y-6">
          <AnimatedSection
            direction="down"
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tighter">
                THE CATALOG
              </h1>
              <p className="text-gray-500 dark:text-zinc-400">
                Professional gear for every creator.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter gear..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-teal-500 transition-all outline-none text-black"
                />
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection
            direction="none"
            delay={0.1}
            className="flex flex-wrap gap-2 border-b border-gray-100 pb-8"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedCategory === category
                    ? "bg-black text-white shadow-lg scale-105"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </AnimatedSection>

          <AnimatedSection
            direction="none"
            delay={0.2}
            className="flex items-center gap-4 pb-8"
          >
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
              Price Range:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">{currencySymbol}</span>
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                }
                className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
            <span className="text-zinc-300">-</span>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">{currencySymbol}</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                }
                className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
          </AnimatedSection>
        </header>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="py-32 text-center space-y-4">
            <h3 className="text-xl font-bold text-red-500">Error</h3>
            <p className="text-zinc-400">{error}</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <AnimatedSection
            direction="none"
            className="py-32 text-center space-y-4"
          >
            <div className="text-6xl text-gray-200">:(</div>
            <h3 className="text-xl font-bold">No gear found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="text-teal-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </AnimatedSection>
        )}
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-32 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
