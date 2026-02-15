"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Icon imports
import { X, Loader2 } from "lucide-react";

// Props interface defining the expected inputs for the modal
interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title?: string;
  description?: string;
}

export default function VideoModal({
  isOpen,
  onClose,
  videoId,
  title = "Cinematic Experience",
  description = "Watch our latest product reveal and see what's possible with professional gear.",
}: VideoModalProps) {
  // State to track if the iframe video has finished loading
  const [isLoaded, setIsLoaded] = useState(false);

  // Effect to handle closing the modal when the Escape key is pressed
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    // AnimatePresence handles the exit animations when the modal is removed from the DOM
    <AnimatePresence onExitComplete={() => setIsLoaded(false)}>
      {isOpen && (
        // Backdrop overlay: fades in/out and blurs the background
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
          onClick={onClose}
        >
          {/* Modal content container: scales up/down with spring physics */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-4xl bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the video
          >
            {/* Video Player Section */}
            <div className="relative w-full aspect-video bg-black">
              {/* Close button positioned in the top-right corner */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 text-white/50 hover:text-white transition-colors"
              >
                <X size={32} />
              </button>

              {/* Loading spinner shown while the iframe is loading */}
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
              )}

              {/* YouTube Iframe */}
              <iframe
                onLoad={() => setIsLoaded(true)}
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            {/* Text content area below the video */}
            <div className="p-8 space-y-2 bg-gradient-to-br from-zinc-900 to-black border-t border-zinc-800">
              <h3 className="text-2xl font-black text-white tracking-tight">
                {title}
              </h3>
              <p className="text-zinc-400 leading-relaxed">{description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
