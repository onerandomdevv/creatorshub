"use client";

import { useState } from "react";
import { X, Lock, Loader2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
  title?: string;
  description?: string;
  loading?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  description = "This action cannot be undone. Please enter your password to confirm.",
  loading = false,
}: DeleteConfirmationModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Password is required");
      return;
    }
    setError("");
    await onConfirm(password);
    setPassword(""); // Clear password on potential failure or success handled by parent
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-800">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              {title}
            </h3>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              <p className="text-zinc-400 text-sm">{description}</p>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">
                  Password Confirmation
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    disabled={loading}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="Enter your password"
                    autoFocus
                  />
                </div>
                {error && <p className="text-red-500 text-xs">{error}</p>}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800 bg-zinc-900/50">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !password}
                className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>Delete Item</>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
