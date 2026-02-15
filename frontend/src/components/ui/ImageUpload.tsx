"use client";

import { useState, useCallback } from "react";
import { Upload, X, CheckCircle, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  disabled,
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.match("image.*")) {
      toast.error("Please upload an image file");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const path = await api.uploadImage(formData);
      // Ensure path is clean (remove potential double slashes if backend returns lead slash)
      // Backend returns "/uploads/..." usually.
      onChange(path);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const backgroundImage =
    value?.startsWith("http") || value?.startsWith("/") ? value : `/${value}`;

  return (
    <div className="space-y-4 w-full">
      <div
        onDrop={disabled ? undefined : onDrop}
        onDragOver={disabled ? undefined : onDragOver}
        onDragLeave={disabled ? undefined : onDragLeave}
        className={`
            relative aspect-video rounded-3xl overflow-hidden border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center p-6 cursor-pointer group
            ${isDragging ? "border-teal-500 bg-teal-500/5" : "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input
          type="file"
          accept="image/*"
          disabled={disabled || loading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-500 text-sm font-bold animate-pulse">
              UPLOADING...
            </p>
          </div>
        ) : value ? (
          <div className="absolute inset-0 w-full h-full">
            <div className="relative w-full h-full">
              <Image
                src={backgroundImage}
                alt="Upload"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="px-4 py-2 bg-black/80 rounded-full text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <Upload size={14} /> Change Image
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-zinc-500 group-hover:text-zinc-300 transition-colors">
            <div
              className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center mb-2 transition-colors
                    ${isDragging ? "bg-teal-500 text-black" : "bg-zinc-800 text-zinc-400"}
                  `}
            >
              {isDragging ? <CheckCircle size={32} /> : <ImageIcon size={32} />}
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-white">
                Drag & drop or Click to upload
              </p>
              <p className="text-xs">Supports JPG, PNG (Max 5MB)</p>
            </div>
          </div>
        )}
      </div>

      {/* Fallback/Manual Input - Optional, keeping it hidden if basic drag/drop works, or expose it? */}
      {/* User asked for Drag & Drop, so this main area covers it. */}
    </div>
  );
}
