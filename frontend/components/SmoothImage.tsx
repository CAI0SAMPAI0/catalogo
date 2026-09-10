"use client";

import { normalizeImageUrl } from "@/lib/imageUtils";
import Image from "next/image";
import { useState } from "react";

interface SmoothImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallbackText?: string;
  priority?: boolean;
  sizes?: string;
}

export default function SmoothImage({
  src,
  alt,
  className = "",
  containerClassName = "",
  fallbackText,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: SmoothImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const cleanSrc = normalizeImageUrl(src);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Skeleton Shimmer enquanto a imagem carrega */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-shimmer" />
      )}

      {!hasError && cleanSrc ? (
        <Image
          src={cleanSrc}
          alt={alt || ""}
          fill
          priority={priority}
          sizes={sizes}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          className={`object-cover transition-all duration-500 ease-out ${isLoaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-[2px] scale-105"
            } ${className}`}
        />
      ) : (
        <div className="w-full h-full min-h-[80px] flex flex-col items-center justify-center bg-slate-800 p-3 text-center text-slate-400">
          <span className="text-xs">{fallbackText || alt || "Imagem indisponível"}</span>
        </div>
      )}
    </div>
  );
}

