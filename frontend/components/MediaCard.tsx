"use client";

import { useState, memo } from "react";
import StarRating from "./StarRating";
import { MessageSquare, Trash2, Layers, ChevronLeft, ChevronRight } from "lucide-react";

export interface MediaCardItem {
  id: number;
  title: string;
  genre: string[];
  desc?: string | null;
  year?: number | null;
  rating: number | null;
  reviews: number;
  img: string;
  images?: string[];
  platforms?: string[];
}

interface MediaCardProps {
  item: MediaCardItem;
  accentColor?: string;
  onOpenReviews?: (item: MediaCardItem) => void;
  onDelete?: (id: number) => Promise<void>;
}

function MediaCard({
  item,
  accentColor = "#2563eb",
  onOpenReviews,
  onDelete,
}: MediaCardProps) {
  const [liked, setLiked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Lista de imagens para carrossel (capa principal + imagens extras)
  const allImages = [
    item.img,
    ...(item.images ? item.images.filter((img) => img && img !== item.img) : []),
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  function nextImage(e: React.MouseEvent) {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  }

  function prevImage(e: React.MouseEvent) {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!onDelete) return;

    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(item.id);
    } catch {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  }

  const currentImage = allImages[currentImageIndex] || item.img;

  return (
    <div
      className="card-item-optimized card-hover rounded-xl overflow-hidden flex flex-col cursor-pointer group bg-white border border-slate-200/90 shadow-xs"
      onClick={() => onOpenReviews?.(item)}
    >
      {/* Imagem de Capa ou Carrossel */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={currentImage}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="img-overlay absolute inset-0 pointer-events-none" />

        {/* Setas do Carrossel (caso tenha mais de 1 foto) */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90 z-20 cursor-pointer"
              title="Foto anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90 z-20 cursor-pointer"
              title="Próxima foto"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Indicadores de bolinha (dots) */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1 z-10 bg-black/75 px-1.5 py-0.5 rounded-full border border-white/10">
              {allImages.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex ? "w-3 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Badges de Gênero / Categoria no topo esquerdo */}
        <div className="absolute top-2.5 left-2.5 flex gap-1 flex-wrap max-w-[70%] z-10 pointer-events-none">
          {item.genre.slice(0, 2).map((g) => (
            <span
              key={g}
              className="text-[11px] px-2 py-0.5 rounded-md font-bold shadow-xs bg-white/95 border border-slate-200/90"
              style={{
                color: accentColor,
                fontFamily: "var(--font-rajdhani), sans-serif",
              }}
            >
              {g}
            </span>
          ))}
        </div>

        {/* Botões de Ação no topo direito: Like & Excluir */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          {onDelete && (
            <button
              onClick={handleDelete}
              onMouseLeave={() => setConfirmDelete(false)}
              disabled={isDeleting}
              title={confirmDelete ? "Confirmar exclusão?" : "Excluir"}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors text-white cursor-pointer border border-white/15 ${
                confirmDelete ? "bg-red-500 hover:bg-red-600" : "bg-black/70 hover:bg-black/90"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer bg-black/70 hover:bg-black/90 border border-white/15"
            title={liked ? "Descurtir" : "Favoritar"}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={liked ? "#ef4444" : "none"}
              stroke={liked ? "#ef4444" : "#ffffff"}
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Plataformas (se houver) */}
        {item.platforms && item.platforms.length > 0 && (
          <div className="absolute bottom-2 left-2.5 flex items-center gap-1 z-10 pointer-events-none">
            <Layers className="w-3.5 h-3.5 text-white/90" />
            <div className="flex gap-1">
              {item.platforms.slice(0, 3).map((plat) => (
                <span
                  key={plat}
                  className="rounded bg-black/75 px-1.5 py-0.2 text-[10px] font-semibold text-white border border-white/10"
                >
                  {plat}
                </span>
              ))}
              {item.platforms.length > 3 && (
                <span className="rounded bg-black/75 px-1 py-0.2 text-[10px] text-white/80 border border-white/10">
                  +{item.platforms.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo / Detalhes */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3
            className="text-base font-bold leading-tight mb-1 text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1"
            style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
          >
            {item.title}
          </h3>

          <p className="text-xs leading-relaxed text-slate-600 line-clamp-2 mb-3">
            {item.desc || "Sem descrição informada."}
          </p>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <StarRating rating={item.rating} size="sm" />
            <span className="font-bold text-amber-500">
              {item.rating ? item.rating.toFixed(1) : "—"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{item.reviews} reviews</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(MediaCard);
