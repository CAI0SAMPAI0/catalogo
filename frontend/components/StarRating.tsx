"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number | null;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = "md",
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const currentRating = rating ?? 0;

  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.round(currentRating);

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(starValue)}
            className={`transition-transform ${
              interactive
                ? "cursor-pointer hover:scale-125 focus:outline-none"
                : "cursor-default"
            }`}
            title={interactive ? `Nota ${starValue}` : undefined}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled
                  ? "text-amber-400 fill-amber-400"
                  : "text-slate-600 fill-slate-800/40"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
