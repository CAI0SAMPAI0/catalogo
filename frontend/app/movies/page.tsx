"use client";

import FilterDropdown from "@/components/FilterDropdown";
import GameModal from "@/components/GameModal";
import InfiniteScrollSentinel from "@/components/InfiniteScrollSentinel";
import MediaCard, { MediaCardItem } from "@/components/MediaCard";
import { FilmIcon } from "@/components/MediaIcons";
import ReviewModal from "@/components/ReviewModal";
import { createMovie, deleteMovie, getMovies } from "@/lib/api";
import { getMovieCover } from "@/lib/catalogData";
import { GameCreateInput, Movie } from "@/types/game";
import { AlertTriangle, Plus, RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 9;

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState("Todos");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedMovieForReview, setSelectedMovieForReview] = useState<Movie | null>(null);

  const accentColor = "#e11d48";

  async function loadMovies() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getMovies();
      setMovies(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao carregar filmes do Neon PostgreSQL.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;
    getMovies()
      .then((data) => {
        if (!ignore) {
          setMovies(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Erro ao carregar filmes do Neon PostgreSQL.");
          setIsLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const genres = useMemo(() => {
    const list = new Set<string>(["Todos"]);
    movies.forEach((m) => {
      if (m.genre) list.add(m.genre);
      if (m.type && m.type !== m.genre) list.add(m.type);
    });
    return Array.from(list);
  }, [movies]);

  const mediaItems: MediaCardItem[] = useMemo(() => {
    return movies.map((m) => ({
      id: m.id,
      title: m.name,
      genre: Array.from(new Set([m.type, ...(m.genre ? [m.genre] : [])].filter(Boolean) as string[])),
      desc: m.description,
      year: m.release_date ? parseInt(m.release_date.split("-")[0]) : undefined,
      rating: m.average_rating,
      reviews: m.review_count,
      img: m.cover_url || getMovieCover(m.name, m.type),
      images: m.images && m.images.length > 0 ? m.images : undefined,
      platforms: m.platforms,
    }));
  }, [movies]);

  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: movies.length };
    mediaItems.forEach((item) => {
      item.genre.forEach((g) => {
        counts[g] = (counts[g] || 0) + 1;
      });
    });
    return counts;
  }, [mediaItems, movies.length]);

  const mainGenres = ["Todos", "Sci-Fi", "Drama", "Ação"];

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

  async function handleCreateMovie(data: GameCreateInput) {
    const newMovie = await createMovie(data);
    setMovies((prev) => [newMovie, ...prev]);
  }

  async function handleDeleteMovie(movieId: number) {
    await deleteMovie(movieId);
    setMovies((prev) => prev.filter((m) => m.id !== movieId));
  }

  async function handleReviewChange() {
    const fresh = await getMovies();
    setMovies(fresh);
    if (selectedMovieForReview) {
      const updated = fresh.find((m) => m.id === selectedMovieForReview.id);
      if (updated) setSelectedMovieForReview(updated);
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span style={{ color: accentColor }}>
              <FilmIcon className="w-8 h-8" />
            </span>
            <h1
              className="text-3xl font-bold text-slate-900 tracking-tight"
              style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
            >
              Catálogo de Filmes
            </h1>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-rose-50 text-rose-700 border border-rose-200"
              style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
            >
              {movies.length} {movies.length === 1 ? "filme" : "filmes"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadMovies}
            title="Atualizar lista do banco"
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-rose-600" : ""}`} />
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md shadow-rose-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            style={{
              background: accentColor,
              fontFamily: "var(--font-rajdhani), sans-serif",
              fontSize: "0.95rem",
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Filme</span>
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
            onClick={loadMovies}
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
            placeholder="Buscar filmes por nome, gênero ou sinopse..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-600/10 transition-all"
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
                    ? "bg-rose-600 text-white shadow-xs"
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
            Nenhum filme encontrado
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
                  const found = movies.find((m) => m.id === card.id);
                  if (found) setSelectedMovieForReview(found);
                }}
                onDelete={handleDeleteMovie}
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
        onSubmit={handleCreateMovie}
      />

      {selectedMovieForReview && (
        <ReviewModal
          item={selectedMovieForReview}
          mediaType="movies"
          accentColor={accentColor}
          isOpen={!!selectedMovieForReview}
          onClose={() => setSelectedMovieForReview(null)}
          onReviewChange={handleReviewChange}
        />
      )}
    </main>
  );
}
