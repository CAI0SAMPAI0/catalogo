"use client";

import FilterDropdown from "@/components/FilterDropdown";
import GameModal from "@/components/GameModal";
import InfiniteScrollSentinel from "@/components/InfiniteScrollSentinel";
import MediaCard, { MediaCardItem } from "@/components/MediaCard";
import { TvIcon } from "@/components/MediaIcons";
import ReviewModal from "@/components/ReviewModal";
import { createSerie, deleteSerie, getSeries } from "@/lib/api";
import { getSerieCover } from "@/lib/catalogData";
import { GameCreateInput, Serie } from "@/types/game";
import { AlertTriangle, Plus, RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

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
    let ignore = false;
    getSeries()
      .then((data) => {
        if (!ignore) {
          setSeries(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Erro ao carregar séries do Neon PostgreSQL.");
          setIsLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const genres = useMemo(() => {
    const list = new Set<string>(["Todos"]);
    series.forEach((s) => {
      if (s.genre) list.add(s.genre);
      if (s.type && s.type !== s.genre) list.add(s.type);
    });
    return Array.from(list);
  }, [series]);

  const mediaItems: MediaCardItem[] = useMemo(() => {
    return series.map((s) => ({
      id: s.id,
      title: s.name,
      genre: Array.from(new Set([s.type, ...(s.genre ? [s.genre] : [])].filter(Boolean) as string[])),
      desc: s.description,
      year: s.release_date ? parseInt(s.release_date.split("-")[0]) : undefined,
      rating: s.average_rating,
      reviews: s.review_count,
      img: s.cover_url || getSerieCover(s.name, s.type),
      images: s.images && s.images.length > 0 ? s.images : undefined,
      platforms: s.platforms,
    }));
  }, [series]);

  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: series.length };
    mediaItems.forEach((item) => {
      item.genre.forEach((g) => {
        counts[g] = (counts[g] || 0) + 1;
      });
    });
    return counts;
  }, [mediaItems, series.length]);

  const mainGenres = ["Todos", "Drama", "Sci-Fi", "Animação"];

  function handleSearchChange(val: string) {
    setSearch(val);
    setVisibleCount(PAGE_SIZE);
  }

  function handleGenreChange(genre: string) {
    setActiveGenre(genre);
    setVisibleCount(PAGE_SIZE);
  }

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
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar séries por nome, gênero ou sinopse..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/10 transition-all"
          />
        </div>

        {/* Controles de Filtro: Pílulas Principais + Caixa Suspensa para todos os subgêneros */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex gap-1.5 items-center overflow-x-auto scrollbar-hide">
            {mainGenres.map((g) => {
              const isActive = activeGenre === g;
              return (
                <button
                  key={g}
                  onClick={() => handleGenreChange(g)}
                  className={`text-xs px-3 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${isActive
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

          <FilterDropdown
            genres={genres}
            activeGenre={activeGenre}
            onSelectGenre={handleGenreChange}
            accentColor={accentColor}
            counts={genreCounts}
            label="Gênero"
          />
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
          item={selectedSerieForReview}
          mediaType="series"
          accentColor={accentColor}
          isOpen={!!selectedSerieForReview}
          onClose={() => setSelectedSerieForReview(null)}
          onReviewChange={handleReviewChange}
        />
      )}
    </main>
  );
}
