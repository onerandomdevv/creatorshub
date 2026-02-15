"use client";

// React and Next.js imports
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Product } from "@/types/product";

// Component imports
import ProductCard from "@/components/product/Productcard";
import AnimatedSection from "@/components/ui/AnimatedSection";
import NicheSelector from "@/components/home/NicheSelector";
import PlatformMarquee from "@/components/home/PlatformMarquee";
import VideoModal from "@/components/home/VideoModal";

// Icon imports
import { ArrowRight } from "lucide-react";

export default function Home() {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const data = await api.getProducts("isFeatured=true&limit=4");
        if (data.success) {
          setTrendingProducts(data.data);
        }
      } catch (err) {
        console.error("Error fetching trending products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <main className="min-h-screen bg-black">
      {/* Ultra-Premium Hero Section */}
      <section className="relative min-h-[100svh] flex items-center justify-start pt-24 pb-12 overflow-hidden">
        {/* Decorative background elements with animations */}
        <div className="absolute inset-0 z-0">
          {/* Top-left teal glow */}
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-teal-600/20 blur-[150px] rounded-full animate-pulse" />
          {/* Bottom-right purple glow */}
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[150px] rounded-full animate-pulse delay-700" />
          {/* Subtle carbon fibre texture overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>

        {/* Hero content container */}
        <div className="max-w-7xl w-full px-6 md:px-8 md:ml-12 relative z-10 text-left space-y-8 md:space-y-10">
          <div className="max-w-4xl">
            {/* Animated container for the main headline and paragraph */}
            <AnimatedSection direction="up" delay={0.2} className="space-y-6">
              {/* Main headline with gradient text */}
              <h1 className="text-5xl sm:text-8xl md:text-[9rem] font-black text-white leading-[0.9] md:leading-[0.85] tracking-tighter">
                BEYOND <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-white to-purple-400">
                  POSSIBLE.
                </span>
              </h1>
              {/* Sub-headline/description */}
              <p className="text-sm md:text-2xl text-zinc-400 max-w-2xl leading-relaxed font-medium">
                We don&apos;t just sell gear. We engineer the bridge between
                your imagination and the screen. Professional equipment for the
                visionaries of tomorrow.
              </p>
            </AnimatedSection>

            {/* Animated container for Call-to-Action buttons */}
            <AnimatedSection
              direction="up"
              delay={0.4}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-start pt-8"
            >
              {/* Link to the products page */}
              <Link
                href="/products"
                className="group relative px-8 py-4 md:px-12 md:py-5 bg-white text-black rounded-xl md:rounded-2xl font-black text-lg md:text-xl hover:bg-teal-400 transition-all overflow-hidden text-center"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  EXPLORE CATALOG{" "}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>
              {/* Button to open the video modal */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 md:px-12 md:py-5 bg-zinc-900 text-white border border-zinc-800 rounded-xl md:rounded-2xl font-black text-lg md:text-xl hover:bg-zinc-800 transition-all text-center"
              >
                WATCH REEL
              </button>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section 2: Platform Marquee for social proof */}
      <PlatformMarquee />

      {/* Section 3: Niche Selector - Main feature of the page */}
      <NicheSelector />

      {/* Section 4: Featured/Trending Products */}
      <section className="max-w-7xl mx-auto px-8 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          {/* Section title */}
          <AnimatedSection direction="right" className="space-y-4">
            <div className="w-20 h-1 bg-teal-500" />
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
              TRENDING <br /> <span className="text-zinc-600">SELECTIONS.</span>
            </h2>
          </AnimatedSection>
          {/* Link to view all products */}
          <AnimatedSection direction="left">
            <Link
              href="/products"
              className="text-teal-400 font-black flex items-center gap-3 group"
            >
              VIEW FULL ARCHIVE{" "}
              <div className="w-12 h-12 rounded-full border border-teal-500/30 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-black transition-all">
                {/* Note: This uses the custom ArrowRight component defined at the bottom of the file */}
                <CustomArrowRight size={20} />
              </div>
            </Link>
          </AnimatedSection>
        </div>

        {/* Grid of trending product cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] bg-zinc-900 animate-pulse rounded-3xl border border-zinc-800"
                  />
                ))
            : trendingProducts.map((product, i) => (
                <AnimatedSection
                  key={product._id || product.id}
                  delay={i * 0.1}
                >
                  <ProductCard {...product} id={product._id || product.id} />
                </AnimatedSection>
              ))}
        </div>
      </section>

      {/* Section 5: Join the Community CTA */}
      <section className="max-w-7xl mx-auto px-8 pb-32">
        <AnimatedSection
          direction="none"
          className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-32 text-center space-y-8 md:space-y-12 relative overflow-hidden group"
        >
          {/* Subtle hover effect overlay */}
          <div className="absolute inset-0 bg-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <h2 className="text-4xl md:text-8xl font-black text-white leading-[0.9] md:leading-[0.85] tracking-tighter">
            JOIN THE <br /> <span className="text-teal-500">REVOLUTION.</span>
          </h2>
          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto">
            Create an account to unlock exclusive drops, track your orders, and
            get professional setup guides. No spam, just pure value.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 relative z-10">
            <Link
              href="/register"
              className="px-12 py-5 bg-white text-black rounded-2xl font-black text-xl hover:bg-teal-400 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] flex items-center gap-2 group/btn"
            >
              CREATE ACCOUNT
              <CustomArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="px-12 py-5 bg-zinc-900 text-white border border-zinc-800 rounded-2xl font-black text-xl hover:bg-zinc-800 transition-all"
            >
              SIGN IN
            </Link>
          </div>
        </AnimatedSection>
      </section>
      {/* Video Modal Component */}
      {/* It's controlled by the `isModalOpen` state and opens when "WATCH REEL" is clicked. */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoId="dQw4w9WgXcQ" // The YouTube ID of the video to be played
      />
    </main>
  );
}

// Custom ArrowRight SVG component to override default styles.
// This provides more control over stroke-width and other SVG properties than the lucide-react version.
function CustomArrowRight({ size = 24, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
