/**
 * Navbar.tsx
 *
 * The main navigation component of the application.
 * Features:
 * - Dynamic styling based on scroll position (transparent vs opaque).
 * - Live cart item counter.
 * - Responsive layout for mobile and desktop.
 */
"use client";

import Link from "next/link";
import {
  ShoppingCart,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  User,
  Search,
  HelpCircle,
  Home,
  Shield,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation"; // Added useRouter
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext"; // Import AuthContext

export default function Navbar() {
  // Access cart state to display item count
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth(); // Use Auth
  const router = useRouter(); // Use Router

  // State to track if the user has scrolled down
  const [isScrolled, setIsScrolled] = useState(false);
  // State for search
  const [searchQuery, setSearchQuery] = useState("");
  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Get current path to determine if we are on the home page or admin
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isAdmin = pathname?.startsWith("/admin");

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "Cameras", href: "/products" },
    { name: "Audio", href: "/products" },
    { name: "Lighting", href: "/products" },
    { name: "About", href: "/about" },
  ];

  // Close mobile menu on path change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Effect to handle scroll-based styling changes
  // Adds a background and blur when scrolled past 20px
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide Navbar on Admin pages
  if (isAdmin) return null;

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle Protected Link Clicks
  const handleProtectedLink = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (isAuthenticated) {
      router.push(href);
    } else {
      // You could add a toast here: "Please login to access this feature"
      router.push("/login");
    }
  };

  return (
    // Main Navigation Container
    // Applies fixed positioning and dynamic background styles based on scroll state
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-8 ${
        isScrolled
          ? "py-4 bg-black/60 backdrop-blur-2xl border-b border-zinc-800"
          : "py-8 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Navigation Section */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg md:rounded-xl flex items-center justify-center text-black font-black text-lg md:text-xl group-hover:bg-teal-400 transition-colors shadow-2xl">
              C
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-lg md:text-xl font-black tracking-tighter text-white">
                CREATORS <span className="text-teal-400">HUB.</span>
              </span>
              <span className="text-[10px] font-black text-teal-500 tracking-[0.3em] uppercase">
                Foundry
              </span>
            </div>
          </Link>

          {/* New Navigation Links */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
            >
              <div className="p-2 group-hover:bg-zinc-800 rounded-full transition-colors">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest hidden xl:block">
                Home
              </span>
            </Link>

            <Link
              href="/products"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
            >
              <div className="p-2 group-hover:bg-zinc-800 rounded-full transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest hidden xl:block">
                Shop
              </span>
            </Link>
          </div>
        </div>

        {/* Search Bar - Center */}
        <form
          onSubmit={handleSearch}
          className="hidden lg:flex flex-1 max-w-2xl mx-12 relative group z-50"
        >
          <input
            type="text"
            placeholder="Search products, brands and categories"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-l-lg py-3 px-4 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-zinc-500"
          />
          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-400 text-black font-bold uppercase tracking-wide px-8 rounded-r-lg transition-colors flex items-center gap-2"
          >
            Search
          </button>
        </form>

        {/* Right Side Actions: Account, Help, Cart, Mobile Menu */}
        <div className="flex items-center gap-6 xl:gap-8">
          {/* Admin Dashboard - Only for Admins */}
          {isAuthenticated && user?.role === "admin" && (
            <Link
              href="/admin"
              className="hidden md:flex items-center gap-2 group p-2 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl border border-indigo-500/20 transition-all"
            >
              <Shield className="w-5 h-5 text-indigo-400" />
              <span className="hidden xl:inline text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Dashboard
              </span>
            </Link>
          )}

          {/* Account Link */}
          {isAuthenticated ? (
            <div
              className="hidden md:flex items-center gap-2 group cursor-pointer"
              onClick={() => router.push("/dashboard")}
            >
              <div className="p-2 group-hover:bg-zinc-800 rounded-full transition-colors">
                <User className="w-6 h-6 text-teal-400 group-hover:text-white transition-colors" />
              </div>
              <div className="hidden xl:flex flex-col items-start -space-y-1">
                <span className="text-[10px] text-zinc-500">Welcome Back,</span>
                <div className="flex items-center gap-1 font-bold text-white text-sm">
                  {user?.name || "Account"}{" "}
                  <ArrowRight className="w-3 h-3 rotate-90" />
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/register"
              className="hidden md:flex items-center gap-2 group"
            >
              <div className="p-2 group-hover:bg-zinc-800 rounded-full transition-colors">
                <User className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
              </div>
              <div className="hidden xl:flex flex-col items-start -space-y-1">
                <span className="text-[10px] text-zinc-500">
                  Hello, Sign In
                </span>
                <div className="flex items-center gap-1 font-bold text-white text-sm">
                  Account <ArrowRight className="w-3 h-3 rotate-90" />
                </div>
              </div>
            </Link>
          )}

          {/* About Link - Desktop */}
          <Link
            href="/about"
            className="hidden xl:flex items-center gap-2 group"
          >
            <div className="flex flex-col items-start -space-y-1">
              <span className="text-zinc-500 text-sm font-medium group-hover:text-white transition-colors">
                About
              </span>
              <span className="text-[10px] text-teal-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                US
              </span>
            </div>
          </Link>

          {/* Help Menu */}
          {/* Help Menu with Dropdown */}
          <div className="relative group z-50">
            <button className="hidden md:flex items-center gap-2">
              <div className="p-2 group-hover:bg-zinc-800 rounded-full transition-colors">
                <HelpCircle className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
              </div>
              <div className="hidden xl:flex flex-col items-start -space-y-1">
                <span className="text-zinc-500 text-sm font-medium group-hover:text-white transition-colors">
                  Help
                </span>
                <ArrowRight className="w-3 h-3 rotate-90 text-zinc-500 group-hover:rotate-[-90deg] transition-transform" />
              </div>
            </button>

            {/* Dropdown Content */}
            <div className="absolute top-full right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right translate-y-2 group-hover:translate-y-0 overflow-hidden">
              <div className="p-2 space-y-1">
                {[
                  { name: "Help Center", protected: false, href: "/help" },
                  { name: "Place an Order", protected: true },
                  { name: "Payment Options", protected: false },
                  { name: "Track an Order", protected: true },
                  { name: "Cancel an Order", protected: true },
                  { name: "Returns & Refunds", protected: false },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href || "#"}
                    onClick={(e) =>
                      item.protected
                        ? handleProtectedLink(e, item.href || "/dashboard")
                        : null
                    }
                    className={`block px-4 py-3 text-sm rounded-xl transition-colors text-left ${item.protected && !isAuthenticated ? "text-zinc-500 hover:text-red-400 hover:bg-zinc-800" : "text-zinc-400 hover:text-white hover:bg-zinc-800"}`}
                  >
                    {item.name}{" "}
                    {item.protected && !isAuthenticated && "(Login Required)"}
                  </a>
                ))}
              </div>

              <div className="p-4 border-t border-zinc-800">
                <p className="text-zinc-500 text-xs text-center">
                  Need more help?{" "}
                  <Link href="#" className="text-teal-500 hover:underline">
                    Contact Support
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Shopping Cart Link */}
          <Link href="/cart" className="relative group flex items-center gap-2">
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-white group-hover:text-teal-400 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-teal-500 text-black text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-lg border-2 border-black">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden xl:block font-bold text-white text-sm">
              Cart
            </span>
          </Link>

          {/* Mobile Menu Button (Hamburger) */}
          <button
            className="lg:hidden p-2.5 md:p-3 bg-zinc-900 text-white rounded-xl md:rounded-2xl border border-zinc-800 transition-colors hover:border-zinc-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-[73px] md:top-[89px] bg-black z-50 lg:hidden flex flex-col p-8 space-y-8"
          >
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative group mb-4">
                <input
                  type="text"
                  placeholder="Search gear..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-2xl py-4 px-6 focus:outline-none focus:border-teal-500 transition-all placeholder:text-zinc-500"
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-500"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-3xl font-black text-white uppercase tracking-tighter hover:text-teal-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-8 border-t border-zinc-800 space-y-4">
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
                Account & Admin
              </p>

              {isAuthenticated && user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center justify-between bg-indigo-500/10 p-6 rounded-3xl border border-indigo-500/20 group"
                >
                  <div className="flex items-center gap-4">
                    <Shield className="w-6 h-6 text-indigo-400" />
                    <span className="text-xl font-black text-indigo-300 uppercase tracking-tight">
                      Admin Panel
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-indigo-400" />
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-between bg-zinc-900 p-6 rounded-3xl border border-zinc-800 group"
                  >
                    <div className="flex items-center gap-4">
                      <User className="w-6 h-6 text-teal-400" />
                      <span className="text-xl font-black text-white uppercase tracking-tight">
                        My Account
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="w-full flex items-center justify-center p-6 rounded-3xl border border-zinc-800 text-zinc-500 font-bold uppercase tracking-widest hover:text-red-500 transition-colors"
                  >
                    log out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center justify-between bg-zinc-900 p-6 rounded-3xl border border-zinc-800 group"
                >
                  <span className="text-xl font-black text-white uppercase tracking-tight">
                    Sign In
                  </span>
                  <div className="bg-zinc-800 p-2 rounded-full">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </Link>
              )}

              <Link
                href="/cart"
                className="flex items-center justify-between bg-zinc-900 p-6 rounded-3xl border border-zinc-800 group"
              >
                <div className="flex items-center gap-4">
                  <ShoppingCart className="w-6 h-6 text-teal-400" />
                  <span className="text-xl font-black text-white uppercase tracking-tight">
                    Shopping Cart
                  </span>
                </div>
                <div className="bg-teal-500 text-black font-black rounded-lg px-3 py-1 text-sm">
                  {cartCount}
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
