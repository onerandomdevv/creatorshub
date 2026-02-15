/**
 * Footer.tsx
 *
 * Global footer component.
 * Includes branding, newsletter signup, navigation links,
 * functional social media links, and a premium decorative vibe.
 */
"use client";

import Link from "next/link";
import {
  Instagram,
  Twitter,
  Youtube,
  MessageCircle,
  Linkedin,
  Github,
  ArrowRight,
  Mail,
} from "lucide-react";
import AnimatedSection from "../ui/AnimatedSection";

import { usePathname } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";

export default function Footer() {
  const pathname = usePathname();
  const { settings } = useSettings();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <footer className="bg-black text-white pt-32 pb-12 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-24">
          {/* Brand & Newsletter */}
          <div className="space-y-12">
            <Link
              href="/"
              className="text-4xl font-black tracking-tighter inline-flex items-center gap-2"
            >
              <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center text-black text-xl">
                C
              </div>
              <span className="text-white">CREATORS</span>{" "}
              <span className="text-teal-400">HUB.</span>
            </Link>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold max-w-sm">
                Elevate your production with professional insights.
              </h3>
              <p className="text-zinc-500 max-w-md">
                Join over 50,000+ creators receiving our weekly digest on gear,
                setups, and industry trends.
              </p>

              <div className="flex gap-2 max-w-md group">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-teal-500 transition-colors" />
                  <input
                    type="email"
                    placeholder={settings?.supportEmail || "creator@studio.com"}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-teal-500 transition-all outline-none text-zinc-300"
                  />
                </div>
                <button className="bg-white text-black px-8 rounded-2xl font-black hover:bg-teal-400 transition-colors flex items-center gap-2 group/btn shrink-0">
                  JOIN{" "}
                  <ArrowRight
                    size={20}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">
                Explore
              </h4>
              <ul className="space-y-4">
                {["Shop All", "Cameras", "Audio", "Lighting", "Streaming"].map(
                  (link) => (
                    <li key={link}>
                      <Link
                        href="/products"
                        className="text-zinc-300 hover:text-white transition-colors flex items-center gap-2 group"
                      >
                        <div className="w-1 h-1 bg-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">
                Company
              </h4>
              <ul className="space-y-4">
                {[
                  { name: "About Us", href: "/about" },
                  { name: "Careers", href: "/" },
                  { name: "News", href: "/" },
                  { name: "Privacy", href: "/" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <div className="w-1 h-1 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">
                Help
              </h4>
              <ul className="space-y-4">
                {["Support", "Shipping", "Returns", "Contact"].map((link) => (
                  <li key={link}>
                    <Link
                      href="/"
                      className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <div className="w-1 h-1 bg-zinc-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-400 text-sm">
          <div className="space-y-2 text-center md:text-left">
            <p>
              © 2026 {settings?.storeName || "Creators Hub Inc."} Designed for
              the bold.
            </p>
            <p className="text-zinc-500 font-medium">
              {settings?.address ||
                "123 Creator Boulevard, Studio City, CA 90210"}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 items-center">
            {settings?.socialMedia?.instagram && (
              <Link
                href={settings.socialMedia.instagram}
                target="_blank"
                className="hover:text-teal-400 transition-colors"
              >
                <Instagram size={20} />
              </Link>
            )}
            {settings?.socialMedia?.twitter && (
              <Link
                href={settings.socialMedia.twitter}
                target="_blank"
                className="hover:text-teal-400 transition-colors"
              >
                <Twitter size={20} />
              </Link>
            )}
            {settings?.socialMedia?.whatsapp && (
              <Link
                href={settings.socialMedia.whatsapp}
                target="_blank"
                className="hover:text-teal-400 transition-colors"
              >
                <MessageCircle size={20} />
              </Link>
            )}
            {settings?.socialMedia?.youtube && (
              <Link
                href={settings.socialMedia.youtube}
                target="_blank"
                className="hover:text-teal-400 transition-colors"
              >
                <Youtube size={20} />
              </Link>
            )}
            {settings?.socialMedia?.linkedin && (
              <Link
                href={settings.socialMedia.linkedin}
                target="_blank"
                className="hover:text-teal-400 transition-colors"
              >
                <Linkedin size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Blob */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/5 blur-[120px] translate-y-1/2 translate-x-1/2 rounded-full" />
    </footer>
  );
}
