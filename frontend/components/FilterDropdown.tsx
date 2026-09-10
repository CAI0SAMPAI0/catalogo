"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Filter, ChevronDown, Check, X, Search } from "lucide-react";

interface FilterDropdownProps {
  genres: string[];
  activeGenre: string;
  onSelectGenre: (genre: string) => void;
  accentColor?: string;
  counts?: Record<string, number>;
  label?: string;
}

export default function FilterDropdown({
  genres,
  activeGenre,
  onSelectGenre,
  accentColor = "#22c55e",
  counts = {},
  label = "Gênero",
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Filtra a lista de gêneros pela busca interna
  const filteredGenres = useMemo(() => {
    if (!searchTerm.trim()) return genres;
    return genres.filter((g) =>
      g.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [genres, searchTerm]);

  const isFiltered = activeGenre !== "Todos";

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Botão Principal do Dropdown */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer shadow-xs ${
          isFiltered
            ? "text-white border-transparent shadow-md"
            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
        }`}
        style={{
          backgroundColor: isFiltered ? accentColor : undefined,
          fontFamily: "var(--font-rajdhani), sans-serif",
          fontSize: "0.95rem",
        }}
      >
        <Filter className="w-4 h-4 shrink-0" />
        <span>
          {isFiltered ? `${label}: ${activeGenre}` : `Filtrar por ${label}`}
        </span>

        {/* Badge com contagem se filtrado */}
        {isFiltered && counts[activeGenre] !== undefined && (
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-xs bg-black/20 text-white font-mono">
            {counts[activeGenre]}
          </span>
        )}

        <ChevronDown
          className={`w-4 h-4 ml-1 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Caixa Suspensa (Dropdown Modal) */}
      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200/90 shadow-2xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150">
          {/* Cabeçalho do Dropdown */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span
              className="text-xs font-bold text-slate-800 tracking-tight"
              style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
            >
              Selecionar {label} ({genres.length})
            </span>
            {isFiltered && (
              <button
                type="button"
                onClick={() => {
                  onSelectGenre("Todos");
                  setIsOpen(false);
                }}
                className="text-[11px] font-bold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1"
                style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
              >
                <X className="w-3 h-3" />
                <span>Limpar filtro</span>
              </button>
            )}
          </div>

          {/* Campo de Busca Rápida de Gênero */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar gênero na lista..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
              autoFocus
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Lista com Rolagem dos Gêneros */}
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {filteredGenres.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                Nenhum gênero encontrado com &quot;{searchTerm}&quot;
              </div>
            ) : (
              filteredGenres.map((g) => {
                const isSelected = activeGenre === g;
                const count = counts[g];

                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      onSelectGenre(g);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isSelected
                        ? "text-white shadow-xs"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                    style={{
                      backgroundColor: isSelected ? accentColor : "transparent",
                      fontFamily: "var(--font-rajdhani), sans-serif",
                    }}
                  >
                    <span className="truncate pr-2">{g}</span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {count !== undefined && (
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                            isSelected
                              ? "bg-black/20 text-white"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {count}
                        </span>
                      )}
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
