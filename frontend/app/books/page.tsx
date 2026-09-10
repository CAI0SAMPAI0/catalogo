"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { BookIcon } from "@/components/MediaIcons";
import MediaCard, { MediaCardItem } from "@/components/MediaCard";
import ReviewModal from "@/components/ReviewModal";
import GameModal from "@/components/GameModal";
import InfiniteScrollSentinel from "@/components/InfiniteScrollSentinel";
import { Book, GameCreateInput } from "@/types/game";
import { getBooks, createBook, deleteBook } from "@/lib/api";
import { Plus, RefreshCw, AlertTriangle, Search } from "lucide-react";

const PAGE_SIZE = 9;

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState("Todos");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBookForReview, setSelectedBookForReview] = useState<Book | null>(null);

  const accentColor = "#d97706";

  async function loadBooks() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getBooks();
      setBooks(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao carregar livros do Neon PostgreSQL.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  const genres = useMemo(() => {
    const list = new Set<string>(["Todos", "Fantasia", "Sci-Fi", "Cyberpunk", "Distopia", "Épico", "Ficção", "Magia", "Político"]);
    books.forEach((b) => {
      if (b.genre) list.add(b.genre);
      if (b.type) list.add(b.type);
    });
    return Array.from(list);
  }, [books]);

  const mediaItems: MediaCardItem[] = useMemo(() => {
    return books.map((b) => ({
      id: b.id,
      title: b.name,
      genre: [b.type, ...(b.genre ? [b.genre] : [])],
      desc: b.description,
      year: b.release_date ? parseInt(b.release_date.split("-")[0]) : undefined,
      rating: b.average_rating,
      reviews: b.review_count,
      img: b.cover_url || "https://images.unsplash.com/photo-1535905496755-26ae35d0ae54?w=800&h=500&fit=crop",
      images: b.images && b.images.length > 0 ? b.images : undefined,
      platforms: b.platforms,
    }));
  }, [books]);

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

  async function handleCreateBook(data: GameCreateInput) {
    const newBook = await createBook(data);
    setBooks((prev) => [newBook, ...prev]);
  }

  async function handleDeleteBook(bookId: number) {
    await deleteBook(bookId);
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
  }

  async function handleReviewChange() {
    const fresh = await getBooks();
    setBooks(fresh);
    if (selectedBookForReview) {
      const updated = fresh.find((b) => b.id === selectedBookForReview.id);
      if (updated) setSelectedBookForReview(updated);
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span style={{ color: accentColor }}>
              <BookIcon className="w-8 h-8" />
            </span>
            <h1
              className="text-3xl font-bold text-slate-900 tracking-tight"
              style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
            >
              Catálogo de Livros
            </h1>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200"
              style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
            >
              {books.length} {books.length === 1 ? "livro" : "livros"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadBooks}
            title="Atualizar lista do banco"
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-amber-600" : ""}`} />
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md shadow-amber-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            style={{
              background: accentColor,
              fontFamily: "var(--font-rajdhani), sans-serif",
              fontSize: "0.95rem",
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Livro</span>
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
            onClick={loadBooks}
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
            placeholder="Buscar livros por título, gênero ou sinopse..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/10 transition-all"
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
                    ? "bg-amber-600 text-white shadow-xs"
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
            Nenhum livro encontrado
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
                  const found = books.find((b) => b.id === card.id);
                  if (found) setSelectedBookForReview(found);
                }}
                onDelete={handleDeleteBook}
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
        onSubmit={handleCreateBook}
      />

      {selectedBookForReview && (
        <ReviewModal
          item={selectedBookForReview}
          mediaType="books"
          accentColor={accentColor}
          isOpen={!!selectedBookForReview}
          onClose={() => setSelectedBookForReview(null)}
          onReviewChange={handleReviewChange}
        />
      )}
    </main>
  );
}
