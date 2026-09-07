"use client";

import { useState } from "react";
import { Game } from "@/types/game";
import StarRating from "./StarRating";
import { Calendar, MessageSquare, Trash2, Layers, Tag, Loader2 } from "lucide-react";

interface GameCardProps {
  game: Game;
  onOpenReviews: (game: Game) => void;
  onDeleteGame: (gameId: number) => Promise<void>;
}

export default function GameCard({ game, onOpenReviews, onDeleteGame }: GameCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const formattedDate = game.release_date
    ? new Date(game.release_date + "T00:00:00").toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      setIsDeleting(true);
      await onDeleteGame(game.id);
    } catch {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md transition-all duration-300 hover:border-violet-500/50 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-violet-500/5">
      {/* Topo do Card */}
      <div>
        {/* Header: Tipo / Gênero + Botão Deletar */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-violet-500/10 px-2 py-0.5 text-xs font-medium text-violet-400 border border-violet-500/20">
              <Tag className="w-3 h-3" />
              {game.type}
            </span>

            {game.genre && (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300 border border-slate-700">
                {game.genre}
              </span>
            )}
          </div>

          {/* Botão de Excluir */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            onMouseLeave={() => setConfirmDelete(false)}
            title={confirmDelete ? "Clique novamente para confirmar exclusão" : "Excluir jogo"}
            className={`rounded-lg p-1.5 text-xs transition-colors ${
              confirmDelete
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                : "text-slate-500 hover:bg-slate-800 hover:text-rose-400"
            }`}
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
            ) : confirmDelete ? (
              <span className="text-[11px] font-semibold px-1">Confirmar?</span>
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Nome do Jogo */}
        <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-violet-300 transition-colors line-clamp-1">
          {game.name}
        </h3>

        {/* Descrição */}
        {game.description ? (
          <p className="mt-2 text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        ) : (
          <p className="mt-2 text-sm text-slate-600 italic">Sem descrição informada.</p>
        )}

        {/* Plataformas */}
        {game.platforms && game.platforms.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-1">
            <span className="text-xs text-slate-500 mr-1 flex items-center gap-1">
              <Layers className="w-3 h-3" />
            </span>
            {game.platforms.map((plat) => (
              <span
                key={plat}
                className="rounded bg-slate-800/80 px-1.5 py-0.5 text-[11px] font-medium text-slate-300 border border-slate-700/60"
              >
                {plat}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Rodapé do Card */}
      <div className="mt-6 pt-4 border-t border-slate-800/80">
        {/* Data e Avaliação */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            {formattedDate && (
              <>
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </>
            )}
          </div>

          {/* Nota Média */}
          <div className="flex items-center gap-1.5">
            <StarRating rating={game.average_rating} size="sm" />
            <span className="text-xs font-semibold text-amber-400">
              {game.average_rating ? game.average_rating.toFixed(1) : "—"}
            </span>
            <span className="text-[11px] text-slate-500">
              ({game.review_count})
            </span>
          </div>
        </div>

        {/* Botão para Acessar Reviews */}
        <button
          onClick={() => onOpenReviews(game)}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800/80 hover:bg-violet-600 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700/80 hover:border-violet-500 transition-all shadow-sm"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Avaliações & Comentários</span>
        </button>
      </div>
    </div>
  );
}
