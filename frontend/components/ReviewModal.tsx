"use client";

import { useEffect, useState } from "react";
import { X, Star, MessageSquare, Trash2, Send, Loader2, AlertCircle } from "lucide-react";
import { Game, Review } from "@/types/game";
import { getReviews, createReview, deleteReview } from "@/lib/api";
import StarRating from "./StarRating";

interface ReviewModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
  onReviewChange: () => void;
}

export default function ReviewModal({
  game,
  isOpen,
  onClose,
  onReviewChange,
}: ReviewModalProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // Form states
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen || !game) return;

    let mounted = true;

    async function loadReviews() {
      try {
        setIsLoadingReviews(true);
        const data = await getReviews(game!.id);
        if (mounted) setReviews(data);
      } catch (err) {
        console.error("Erro ao carregar avaliações:", err);
      } finally {
        if (mounted) setIsLoadingReviews(false);
      }
    }

    loadReviews();

    return () => {
      mounted = false;
    };
  }, [isOpen, game]);

  if (!isOpen || !game) return null;

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!author.trim()) {
      setFormError("O nome do avaliador é obrigatório.");
      return;
    }

    if (author.trim().length < 2) {
      setFormError("O nome do avaliador deve ter pelo menos 2 caracteres.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setFormError("A nota deve ser entre 1 e 5.");
      return;
    }

    try {
      setIsSubmitting(true);
      const newReview = await createReview(game!.id, {
        author: author.trim(),
        rating,
        comment: comment.trim() || undefined,
      });

      setReviews((prev) => [newReview, ...prev]);
      setAuthor("");
      setRating(5);
      setComment("");
      onReviewChange();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("Erro ao enviar avaliação.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteReview(reviewId: number) {
    try {
      setDeletingId(reviewId);
      await deleteReview(game!.id, reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      onReviewChange();
    } catch (err) {
      console.error("Erro ao deletar avaliação:", err);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative flex flex-col w-full max-w-2xl max-h-[85vh] rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-600 border border-blue-200"
                style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
              >
                {game.type}
              </span>
              <h2
                className="text-xl font-bold text-slate-900 line-clamp-1"
                style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
              >
                {game.name}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Avaliações da comunidade e comentários de jogadores
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Formulário de Envio de Review */}
          <div className="rounded-xl p-4 bg-slate-50 border border-slate-200/80">
            <h3
              className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5 mb-3"
              style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
            >
              <MessageSquare className="w-4 h-4" />
              Deixe sua Avaliação
            </h3>

            {formError && (
              <div className="mb-3 flex items-center gap-2 rounded-xl bg-rose-50 p-2.5 text-xs text-rose-600 border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Nome do Autor */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Seu Nome <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Ex: Geralt de Rívia"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                {/* Seletor de Estrelas Interativo */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sua Nota: <span className="text-amber-500">{rating} de 5</span>
                  </label>
                  <div className="py-1">
                    <StarRating
                      rating={rating}
                      interactive={true}
                      size="lg"
                      onRatingChange={(newRating) => setRating(newRating)}
                    />
                  </div>
                </div>
              </div>

              {/* Comentário */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Comentário ou Análise (Opcional)
                </label>
                <textarea
                  rows={2}
                  maxLength={500}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Conte o que achou da jogabilidade, história ou gráficos..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
                  style={{ fontFamily: "var(--font-rajdhani), sans-serif", fontSize: "0.9rem" }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Publicar Avaliação</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Lista de Avaliações */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3
                className="text-xs font-bold uppercase tracking-wider text-slate-500"
                style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
              >
                Histórico de Avaliações ({reviews.length})
              </h3>
              {game.average_rating && (
                <div className="flex items-center gap-1 text-xs text-slate-600 font-semibold">
                  <span>Média geral:</span>
                  <span className="font-bold text-amber-500">{game.average_rating.toFixed(1)}</span>
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </div>
              )}
            </div>

            {isLoadingReviews ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <span>Carregando avaliações...</span>
              </div>
            ) : reviews.length === 0 ? (
              <div className="py-8 text-center rounded-xl p-6 text-xs border border-dashed border-slate-200 text-slate-500 bg-slate-50/50">
                Nenhuma avaliação cadastrada ainda. Seja o primeiro a avaliar!
              </div>
            ) : (
              <div className="space-y-2.5">
                {reviews.map((rev) => {
                  const dateFormatted = new Date(rev.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={rev.id}
                      className="group relative rounded-xl p-3.5 bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm font-bold text-slate-900"
                            style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
                          >
                            {rev.author}
                          </span>
                          <StarRating rating={rev.rating} size="sm" />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400">{dateFormatted}</span>
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            disabled={deletingId === rev.id}
                            title="Excluir avaliação"
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-all"
                          >
                            {deletingId === rev.id ? (
                              <Loader2 className="w-3 h-3 animate-spin text-rose-500" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {rev.comment ? (
                        <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">Sem comentário escrito.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
