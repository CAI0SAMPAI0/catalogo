"use client";

import { searchCoverFromWeb } from "@/lib/coverSearch";
import { normalizeImageUrl } from "@/lib/imageUtils";
import { GameCreateInput } from "@/types/game";
import { AlertCircle, Globe, Image as ImageIcon, Loader2, Plus, Sparkles, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GameCreateInput) => Promise<void>;
}

const COMMON_PLATFORMS = ["PC", "PlayStation 5", "Xbox Series X", "Nintendo Switch", "PlayStation 4", "Xbox One"];
const COMMON_TYPES = ["RPG", "Ação", "Aventura", "Estratégia", "FPS", "Terror", "Indie", "Plataforma"];

export default function GameModal({ isOpen, onClose, onSubmit }: GameModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [genreName, setGenreName] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [customPlatform, setCustomPlatform] = useState("");

  // Gestão de Capa e Múltiplas Fotos (Carrossel)
  const [coverUrl, setCoverUrl] = useState("");
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [newExtraImageUrl, setNewExtraImageUrl] = useState("");
  const [isSearchingCover, setIsSearchingCover] = useState(false);
  const [autoCoverPreview, setAutoCoverPreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Busca de capa com debounce quando o usuário digita o nome
  useEffect(() => {
    if (!name.trim() || coverUrl) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearchingCover(true);
        const result = await searchCoverFromWeb(name, type);
        setAutoCoverPreview(result.coverUrl);
      } catch {
        // Ignora erro de debounce
      } finally {
        setIsSearchingCover(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [name, type, coverUrl]);

  if (!isOpen) return null;

  function togglePlatform(plat: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(plat) ? prev.filter((p) => p !== plat) : [...prev, plat]
    );
  }

  function addCustomPlatform() {
    const trimmed = customPlatform.trim();
    if (trimmed && !selectedPlatforms.includes(trimmed)) {
      setSelectedPlatforms((prev) => [...prev, trimmed]);
      setCustomPlatform("");
    }
  }

  function addExtraImage() {
    const trimmed = normalizeImageUrl(newExtraImageUrl.trim());
    if (trimmed && !extraImages.includes(trimmed)) {
      setExtraImages((prev) => [...prev, trimmed]);
      setNewExtraImageUrl("");
    }
  }

  function removeExtraImage(idx: number) {
    setExtraImages((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleManualSearchCover() {
    if (!name.trim()) return;
    try {
      setIsSearchingCover(true);
      const result = await searchCoverFromWeb(name, type);
      setCoverUrl(normalizeImageUrl(result.coverUrl));
      if (result.additionalImages && result.additionalImages.length > 0) {
        setExtraImages((prev) =>
          Array.from(new Set([...prev, ...result.additionalImages!.map(normalizeImageUrl)]))
        );
      }
    } catch {
      // Falha silenciosa
    } finally {
      setIsSearchingCover(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("O nome do jogo é obrigatório.");
      return;
    }
    if (!type.trim()) {
      setErrorMessage("O tipo/categoria do jogo é obrigatório.");
      return;
    }

    if (releaseDate) {
      const today = new Date().toISOString().split("T")[0];
      if (releaseDate > today) {
        setErrorMessage("A data de lançamento não pode estar no futuro.");
        return;
      }
    }

    try {
      setIsLoading(true);

      // Se o usuário não colocou capa, busca na web automaticamente em segundo plano!
      let finalCover = normalizeImageUrl(coverUrl.trim());
      let finalImages = extraImages.map(normalizeImageUrl).filter(Boolean);

      if (!finalCover) {
        try {
          const autoFound = await searchCoverFromWeb(name, type);
          if (autoFound.coverUrl) {
            finalCover = normalizeImageUrl(autoFound.coverUrl);
            if (autoFound.additionalImages) {
              finalImages = Array.from(
                new Set([...finalImages, ...autoFound.additionalImages.map(normalizeImageUrl)])
              ).filter(Boolean);
            }
          }
        } catch {
          // Mantém vazio se falhar
        }
      }

      await onSubmit({
        name: name.trim(),
        type: type.trim(),
        genre_name: genreName.trim() || undefined,
        description: description.trim() || undefined,
        release_date: releaseDate || undefined,
        platforms: selectedPlatforms.length > 0 ? selectedPlatforms : undefined,
        cover_url: finalCover || undefined,
        images: finalImages.length > 0 ? finalImages : undefined,
      });

      // Reset
      setName("");
      setType("");
      setGenreName("");
      setDescription("");
      setReleaseDate("");
      setSelectedPlatforms([]);
      setCoverUrl("");
      setExtraImages([]);
      setAutoCoverPreview(null);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Erro ao cadastrar jogo.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const activeCoverDisplay = coverUrl || (name.trim() ? autoCoverPreview : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2
                className="text-lg font-bold text-slate-900 leading-tight"
                style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
              >
                Cadastrar Novo Jogo
              </h2>
              <p className="text-xs text-slate-500">
                Preencha os dados e adicione fotos ou deixe a busca automática encontrar a capa oficial
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {errorMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-600 border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form id="game-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Nome do Jogo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nome do Jogo <span className="text-blue-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Elden Ring, Hollow Knight, Zelda..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 transition-all"
                />
                {name.trim().length > 2 && (
                  <button
                    type="button"
                    onClick={handleManualSearchCover}
                    disabled={isSearchingCover}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
                    title="Buscar capa oficial no Steam / Web"
                  >
                    {isSearchingCover ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>Buscar Capa</span>
                  </button>
                )}
              </div>
            </div>

            {/* Seção de Capa e Prévia Automática */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                  Capa do Jogo
                </label>
                <span className="text-[11px] font-medium text-slate-500">
                  (Opcional • busca automática na web)
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="Cole a URL da capa ou deixe em branco para busca automática..."
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                />
                {coverUrl && (
                  <button
                    type="button"
                    onClick={() => setCoverUrl("")}
                    className="px-2 py-1 text-xs text-slate-400 hover:text-rose-600"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {/* Box de Pré-visualização da Capa */}
              {activeCoverDisplay ? (
                <div className="flex items-center gap-3 pt-1">
                  <div className="relative h-16 w-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-xs shrink-0">
                    <Image
                      src={normalizeImageUrl(activeCoverDisplay)}
                      alt="Prévia da capa"
                      fill
                      sizes="112px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="text-xs text-slate-600">
                    <p className="font-semibold text-slate-800 flex items-center gap-1">
                      {coverUrl ? (
                        "Capa informada manualmente"
                      ) : (
                        <>
                          <Globe className="w-3 h-3 text-blue-600" />
                          Capa encontrada na web automaticamente!
                        </>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Esta imagem será associada como capa do card.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  Caso não informe uma foto, o sistema buscará a arte oficial no Steam / Wikipedia automaticamente.
                </p>
              )}
            </div>

            {/* Adicionar Mais Fotos (Carrossel) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Fotos Adicionais para o Carrossel (Opcional)
              </label>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={newExtraImageUrl}
                  onChange={(e) => setNewExtraImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addExtraImage();
                    }
                  }}
                  placeholder="URL de screenshot ou arte adicional..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addExtraImage}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
                >
                  + Adicionar Foto
                </button>
              </div>

              {/* Lista de Miniaturas das Fotos do Carrossel */}
              {extraImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-1.5 scrollbar-hide">
                  {extraImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="group relative h-14 w-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0"
                    >
                      <Image
                        src={normalizeImageUrl(img)}
                        alt={`Foto ${idx + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => removeExtraImage(idx)}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remover foto"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-300" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tipo e Gênero */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tipo / Categoria <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="Ex: RPG, Ação, FPS"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
                />
                <div className="mt-1 flex flex-wrap gap-1">
                  {COMMON_TYPES.slice(0, 4).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className="text-[11px] font-semibold text-blue-600 hover:underline"
                    >
                      +{t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gênero Específico
                </label>
                <input
                  type="text"
                  value={genreName}
                  onChange={(e) => setGenreName(e.target.value)}
                  placeholder="Ex: Soulslike, Cyberpunk"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Data de Lançamento */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Data de Lançamento (Não pode estar no futuro)
              </label>
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Plataformas */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Plataformas Disponíveis
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {COMMON_PLATFORMS.map((plat) => {
                  const isSelected = selectedPlatforms.includes(plat);
                  return (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => togglePlatform(plat)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${isSelected
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                      {plat}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPlatform}
                  onChange={(e) => setCustomPlatform(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomPlatform();
                    }
                  }}
                  placeholder="Outra plataforma (ex: Steam Deck, Switch OLED)..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomPlatform}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sinopse / Descrição
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve resumo sobre a trama, história ou jogabilidade..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
              />
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="game-form"
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            style={{ fontFamily: "var(--font-rajdhani), sans-serif", fontSize: "0.95rem" }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Salvando & Buscando Capa...</span>
              </>
            ) : (
              <span>Cadastrar Jogo</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
