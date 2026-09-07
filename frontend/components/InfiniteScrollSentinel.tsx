"use client";

import { useEffect, useRef } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

interface InfiniteScrollSentinelProps {
  hasMore: boolean;
  onLoadMore: () => void;
  loadedCount: number;
  totalCount: number;
  accentColor?: string;
}

export default function InfiniteScrollSentinel({
  hasMore,
  onLoadMore,
  loadedCount,
  totalCount,
  accentColor = "#2563eb",
}: InfiniteScrollSentinelProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore) return;

    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "350px", // Pré-carrega 350px antes para scroll 120Hz sem travamento
        threshold: 0.1,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, onLoadMore]);

  if (totalCount === 0) return null;

  return (
    <div className="py-8 flex flex-col items-center justify-center">
      {hasMore ? (
        <div
          ref={sentinelRef}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/90 border border-slate-200 text-slate-600 text-xs font-semibold animate-pulse"
          style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: accentColor }} />
          <span>Carregando mais itens ({loadedCount} de {totalCount})...</span>
        </div>
      ) : totalCount > 9 ? (
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-xs font-semibold"
          style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Todos os {totalCount} itens foram carregados</span>
        </div>
      ) : null}
    </div>
  );
}
