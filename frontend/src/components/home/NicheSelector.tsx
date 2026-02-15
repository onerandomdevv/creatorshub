"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2,
  Tv,
  Music4,
  Video,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import ProductCard from "../product/Productcard";
import AnimatedSection from "../ui/AnimatedSection";
import { api } from "@/lib/api";
import { Product } from "@/types/product";

const NICHES = [
  {
    id: "Streaming",
    icon: Tv,
    color: "from-teal-400 to-blue-600",
    description: "Pro broadcast gear for streamers.",
  },
  {
    id: "Gaming",
    icon: Gamepad2,
    color: "from-red-500 to-purple-600",
    description: "Competitive equipment for gamers.",
  },
  {
    id: "Dancing",
    icon: Music4,
    color: "from-pink-500 to-orange-400",
    description: "Dynamic capturing for movement.",
  },
  {
    id: "Content Creation",
    icon: Video,
    color: "from-yellow-400 to-green-500",
    description: "Versatile tools for vloggers.",
  },
];

export default function NicheSelector() {
  const router = useRouter();
  const [activeNiche, setActiveNiche] = useState(NICHES[0].id);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNicheProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getProducts(`niche=${activeNiche}`);
        if (data.success) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error("Error fetching niche products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNicheProducts();
  }, [activeNiche]);

  const filteredProducts = products;

  return (
    <section className="py-12 md:py-24 bg-zinc-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <AnimatedSection className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
            IDENTIFY YOUR <span className="text-zinc-500 italic">PASSION.</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Select your niche to reveal the professional equipment curated for
            your specific journey.
          </p>
        </AnimatedSection>

        {/* Niche Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-20">
          {NICHES.map((niche) => {
            const Icon = niche.icon;
            const isActive = activeNiche === niche.id;

            return (
              <button
                key={niche.id}
                onClick={() => setActiveNiche(niche.id)}
                className={`relative p-4 md:p-8 rounded-2xl md:rounded-[2rem] border-2 transition-all duration-500 group overflow-hidden ${
                  isActive
                    ? "border-transparent bg-white shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                    : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="niche-bg"
                    className={`absolute inset-0 bg-gradient-to-br ${niche.color} opacity-10`}
                  />
                )}

                <div className="relative z-10 flex flex-col items-center text-center space-y-2 md:space-y-4">
                  <div
                    className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-500 ${
                      isActive
                        ? "bg-black text-white scale-110"
                        : "bg-zinc-800 text-zinc-500 group-hover:text-zinc-300"
                    }`}
                  >
                    <Icon className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <div>
                    <h3
                      className={`font-bold transition-colors text-sm md:text-base ${
                        isActive ? "text-black md:text-xl" : "text-zinc-500"
                      }`}
                    >
                      {niche.id}
                    </h3>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="relative min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNiche + loading}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
            >
              {loading
                ? Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="aspect-[3/4] bg-zinc-900/50 animate-pulse rounded-3xl border border-zinc-800"
                      />
                    ))
                : filteredProducts.slice(0, 7).map((product, i) => (
                    <AnimatedSection
                      key={product._id || product.id}
                      delay={i * 0.05}
                    >
                      <ProductCard
                        {...product}
                        id={product._id || product.id}
                      />
                    </AnimatedSection>
                  ))}

              {!loading && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => router.push("/products")}
                  className={`flex flex-col h-full justify-between p-6 md:p-10 rounded-2xl bg-gradient-to-br ${
                    NICHES.find((n) => n.id === activeNiche)?.color
                  } text-black group cursor-pointer relative z-20`}
                >
                  <div className="space-y-3 md:space-y-4">
                    <Sparkles className="w-8 h-8 md:w-10 md:h-10 animate-pulse" />
                    <h3 className="text-xl md:text-3xl font-black leading-tight uppercase">
                      Complete Your <br /> {activeNiche} Studio
                    </h3>
                    <p className="text-xs md:text-base font-medium opacity-80">
                      Get the full {activeNiche.toLowerCase()} bundle and save
                      15% on your first setup.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px] md:text-sm pt-6 md:pt-8">
                    Get Started{" "}
                    <ChevronRight
                      size={20}
                      className="group-hover:translate-x-2 transition-transform"
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
