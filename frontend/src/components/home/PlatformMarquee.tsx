"use client";

import { motion } from "framer-motion";
import { Youtube, Instagram, Music2, MonitorPlay, Zap } from "lucide-react";

const PLATFORMS = [
  { name: "YouTube", icon: Youtube, color: "hover:text-red-500" },
  { name: "Twitch", icon: MonitorPlay, color: "hover:text-purple-500" },
  { name: "TikTok", icon: Music2, color: "hover:text-pink-500" },
  { name: "Kick", icon: Zap, color: "hover:text-green-500" },
  { name: "Instagram", icon: Instagram, color: "hover:text-orange-500" },
];

export default function PlatformMarquee() {
  // Duplicate the list to create a seamless loop
  const marqueeItems = [...PLATFORMS, ...PLATFORMS, ...PLATFORMS, ...PLATFORMS];

  return (
    <div className="bg-zinc-950 py-12 border-b border-zinc-900 overflow-hidden relative group">
      {/* Gradient Overlays for smooth entry/exit */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10" />

      <div className="max-w-7xl mx-auto px-8 mb-6">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] text-center">
          Engineered for the industry giants
        </p>
      </div>

      <motion.div
        className="flex gap-20 items-center whitespace-nowrap"
        animate={{
          x: [0, -1035], // Adjust based on content width
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {marqueeItems.map((platform, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 text-zinc-600 transition-all duration-300 ${platform.color} group-hover:opacity-100 opacity-60`}
          >
            <platform.icon size={32} strokeWidth={1.5} />
            <span className="text-2xl font-black uppercase tracking-tighter">
              {platform.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
