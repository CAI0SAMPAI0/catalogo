"use client";

import FilterDropdown from "@/components/FilterDropdown";
import GameModal from "@/components/GameModal";
import InfiniteScrollSentinel from "@/components/InfiniteScrollSentinel";
import MediaCard, { MediaCardItem } from "@/components/MediaCard";
import { GameIcon } from "@/components/MediaIcons";
import ReviewModal from "@/components/ReviewModal";
import { createGame, deleteGame, getGames } from "@/lib/api";
import { getGameCover } from "@/lib/catalogData";
import { Game, GameCreateInput } from "@/types/game";
import { AlertTriangle, Plus, RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 9;

export default function GamesCatalog() {
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState("");
  const [activeGenre, setActiveGenre] = useState("Todos");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGameForReview, setSelectedGameForReview] = useState<Game | null>(null);

  const accentColor = "#2563eb";

  async function loadGames() {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getGames();
      setGames(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro de comunicação com o servidor Django.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadGames();
  }, []);

  // Extrai lista dinâmica de gêneros a partir dos jogos cadastrados
  const genres = useMemo(() => {
    const list = new Set<string>(["Todos"]);
    games.forEach((g) => {
      if (g.genre) list.add(g.genre);
      if (g.type && g.type !== g.genre) list.add(g.type);
    });
    return Array.from(list);
  }, [games]);

  // Converte os dados do Django Ninja para o formato do MediaCard com capa personalizada e fotos extras
  const mediaItems: MediaCardItem[] = useMemo(() => {
    return games.map((g) => ({
      id: g.id,
      title: g.name,
      genre: Array.from(new Set([g.type, ...(g.genre ? [g.genre] : [])].filter(Boolean) as string[])),
      desc: g.description,
      year: g.release_date ? parseInt(g.release_date.split("-")[0]) : undefined,
      rating: g.average_rating,
      reviews: g.review_count,
      img: g.cover_url || getGameCover(g.name, g.type),
      images: g.images && g.images.length > 0 ? g.images : undefined,
      platforms: g.platforms,
    }));
  }, [games]);

  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: games.length };
    mediaItems.forEach((item) => {
      item.genre.forEach((g) => {
        counts[g] = (counts[g] || 0) + 1;
      });
    });
    return counts;
  }, [mediaItems, games.length]);

  const mainGenres = ["Todos", "RPG", "Ação", "Aventura"];

  // Filtra por busca e por gênero selecionado
  const filtered = useMemo(() => {
    return mediaItems.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.desc && item.desc.toLowerCase().includes(search.toLowerCase())) ||
        item.genre.some((g) => g.toLowerCase().includes(search.toLowerCase()));

      const matchGenre =
        activeGenre === "Todos" || item.genre.includes(activeGenre);

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

  async function handleCreateGame(data: GameCreateInput) {
    const newGame = await createGame(data);
    setGames((prev) => [newGame, ...prev]);
  }

  async function handleDeleteGame(gameId: number) {
    await deleteGame(gameId);
    setGames((prev) => prev.filter((g) => g.id !== gameId));
  }

  async function handleReviewChange() {
    const fresh = await getGames();
    setGames(fresh);
    if (selectedGameForReview) {
      const updated = fresh.find((g) => g.id === selectedGameForReview.id);
      if (updated) setSelectedGameForReview(updated);
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Header do Catálogo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span style={{ color: accentColor }}>
              <GameIcon className="w-8 h-8" />
            </span>
            <h1
              className="text-3xl font-bold text-slate-900 tracking-tight"
              style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
            >
              Catálogo de Jogos
            </h1>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200"
              style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
            >
              {games.length} {games.length === 1 ? "item" : "itens"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadGames}
            title="Atualizar lista do backend"
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-95 cursor-pointer"
            style={{ background: accentColor, fontFamily: "var(--font-rajdhani), sans-serif" }}
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Jogo</span>
          </button>
        </div>
      </div>

      {/* Erro de Conexão com API */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-sm">Não foi possível carregar os jogos</h3>
            <p className="text-xs text-amber-700 mt-0.5">{error}</p>
          </div>
          <button
            onClick={loadGames}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 cursor-pointer"
          >
            Tentar Novamente
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar jogos por nome, gênero ou sinopse..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white border border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/10 transition-all"
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
                  onClick={() => setActiveGenre(g)}
                  className={`text-xs px-3 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${isActive
                      ? "bg-blue-600 text-white shadow-xs"
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
            onSelectGenre={setActiveGenre}
            accentColor={accentColor}
            counts={genreCounts}
            label="Gênero"
          />
        </div>
      </div>

      {/* Grid de Itens ou Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 rounded-xl animate-pulse bg-slate-100 border border-slate-200"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-500">
          <Search className="mx-auto mb-3 w-8 h-8 text-slate-300" />
          <p className="font-bold text-slate-700" style={{ fontFamily: "var(--font-rajdhani), sans-serif", fontSize: "1.1rem" }}>
            Nenhum jogo encontrado
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {search ? `Não encontramos títulos para "${search}".` : "Seu catálogo de jogos ainda está vazio."}
          </p>
          {search ? (
            <button
              onClick={() => {
                setSearch("");
                setActiveGenre("Todos");
              }}
              className="mt-4 text-xs font-bold text-blue-600 underline cursor-pointer"
            >
              Limpar filtros de busca
            </button>
          ) : (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm hover:bg-blue-500 cursor-pointer"
            >
              + Adicionar Primeiro Jogo
            </button>
          )}
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
                  const found = games.find((g) => g.id === card.id);
                  if (found) setSelectedGameForReview(found);
                }}
                onDelete={handleDeleteGame}
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

      {/* Modal de Cadastro de Jogo (com Capa, Carrossel e Busca Automática) */}
      <GameModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateGame}
      />

      {/* Modal de Avaliações / Reviews */}
      {selectedGameForReview && (
        <ReviewModal
          item={selectedGameForReview}
          mediaType="games"
          accentColor={accentColor}
          isOpen={!!selectedGameForReview}
          onClose={() => setSelectedGameForReview(null)}
          onReviewChange={handleReviewChange}
        />
      )}
    </main>
  );
}