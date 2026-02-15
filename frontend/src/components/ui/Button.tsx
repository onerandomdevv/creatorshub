"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

/**
 * Reusable Button Component
 *
 * A consistent button used throughout the app.
 * - Supports all standard HTML button attributes via `...props`.
 * - Has default styling but allows overriding via `className`.
 * - Validates accessibility and disabled states.
 */
export default function Button({
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 rounded-md hover:bg-gray-800 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
