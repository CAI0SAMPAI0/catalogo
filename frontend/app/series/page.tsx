"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { TvIcon } from "@/components/MediaIcons";
import MediaCard, { MediaCardItem } from "@/components/MediaCard";
import ReviewModal from "@/components/ReviewModal";
import GameModal from "@/components/GameModal";
import InfiniteScrollSentinel from "@/components/InfiniteScrollSentinel";
import { Serie, GameCreateInput } from "@/types/game";
import { getSeries, createSerie, deleteSerie } from "@/lib/api";
import { Plus, RefreshCw, AlertTriangle, Search } from "lucide-react";

const PAGE_SIZE = 9;

export default function SeriesPage() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState("Todos");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSerieForReview, setSelectedSerieForReview] = useState<Serie | null>(null);

  const accentColor = "#7c3aed";

  async function loadSeries() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getSeries();
      setSeries(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao carregar séries do Neon PostgreSQL.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSeries();
  }, []);

  const genres = useMemo(() => {
    const list = new Set<string>(["Todos", "Drama", "Crime", "Fantasia", "Animação", "Sci-Fi", "Mistério", "Thriller", "História"]);
    series.forEach((s) => {
      if (s.genre) list.add(s.genre);
      if (s.type) list.add(s.type);
    });
    return Array.from(list);
  }, [series]);

  const mediaItems: MediaCardItem[] = useMemo(() => {
    return series.map((s) => ({
      id: s.id,
      title: s.name,
      genre: [s.type, ...(s.genre ? [s.genre] : [])],
      desc: s.description,
      year: s.release_date ? parseInt(s.release_date.split("-")[0]) : undefined,
      rating: s.average_rating,
      reviews: s.review_count,
      img: s.cover_url || "https://images.unsplash.com/photo-1643208589889-0735ad7218f0?w=800&h=500&fit=crop",
      images: s.images && s.images.length > 0 ? s.images : undefined,
      platforms: s.platforms,
    }));
  }, [series]);

  const filtered = useMemo(() => {
    return mediaItems.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.desc && item.desc.toLowerCase().includes(search.toLowerCase())) ||
        item.genre.some((g) => g.toLowerCase().includes(search.toLowerCase()));

      const matchGenre = activeGenre === "Todos" || item.genre.includes(activeGenre);
      return matchSearch && matchGenre;
    });
  }, [mediaItems, search, activeGenre]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, activeGenre]);

  const visibleItems = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, []);

  async function handleCreateSerie(data: GameCreateInput) {
    const newSerie = await createSerie(data);
    setSeries((prev) => [newSerie, ...prev]);
  }

  async function handleDeleteSerie(serieId: number) {
    await deleteSerie(serieId);
    setSeries((prev) => prev.filter((s) => s.id !== serieId));
  }

  async function handleReviewChange() {
    const fresh = await getSeries();
    setSeries(fresh);
    if (selectedSerieForReview) {
      const updated = fresh.find((s) => s.id === selectedSerieForReview.id);
      if (updated) setSelectedSerieForReview(updated);
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span style={{ color: accentColor }}>
              <TvIcon className="w-8 h-8" />
            </span>
            <h1
              className="text-3xl font-bold text-slate-900 tracking-tight"
              style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
            >
              Catálogo de Séries
            </h1>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-50 text-purple-700 border border-purple-200"
              style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
            >
              {series.length} {series.length === 1 ? "série" : "séries"}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Séries sincronizadas diretamente com o banco de dados Neon PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadSeries}
            title="Atualizar lista do banco"
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-purple-600" : ""}`} />
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md shadow-purple-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            style={{
              background: accentColor,
              fontFamily: "var(--font-rajdhani), sans-serif",
              fontSize: "0.95rem",
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Série</span>
          </button>
        </div>
      </div>

      {/* Alerta de erro */}
      {error && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-xl p-3.5 text-xs bg-rose-50 text-rose-700 border border-rose-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadSeries}
            className="px-2.5 py-1 rounded-lg font-bold bg-rose-100 hover:bg-rose-200 cursor-pointer"
          >
            Tentar de novo
          </button>
        </div>
      )}

      {/* Busca e Filtros */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar séries por nome, gênero ou sinopse..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/10 transition-all"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {genres.map((g) => {
            const isActive = activeGenre === g;
            return (
              <button
                key={g}
                onClick={() => setActiveGenre(g)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
                style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-xl animate-pulse bg-slate-100 border border-slate-200" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-500">
          <Search className="mx-auto mb-3 w-8 h-8 text-slate-300" />
          <p className="font-bold text-slate-700" style={{ fontFamily: "var(--font-rajdhani), sans-serif", fontSize: "1.1rem" }}>
            Nenhuma série encontrada
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleItems.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                accentColor={accentColor}
                onOpenReviews={(card) => {
                  const found = series.find((s) => s.id === card.id);
                  if (found) setSelectedSerieForReview(found);
                }}
                onDelete={handleDeleteSerie}
              />
            ))}
          </div>

          <InfiniteScrollSentinel
            hasMore={visibleCount < filtered.length}
            onLoadMore={handleLoadMore}
            loadedCount={visibleItems.length}
            totalCount={filtered.length}
            accentColor={accentColor}
          />
        </>
      )}

      <GameModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSerie}
      />

      {selectedSerieForReview && (
        <ReviewModal
          game={selectedSerieForReview}
          isOpen={!!selectedSerieForReview}
          onClose={() => setSelectedSerieForReview(null)}
          onReviewChange={handleReviewChange}
        />
      )}
    </main>
  );
}
