"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GameIcon, FilmIcon, TvIcon, BookIcon, HomeIcon, MusicIcon } from "./MediaIcons";
import { checkApiHealth } from "@/lib/api";
import { ExternalLink } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isApiOnline, setIsApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    async function ping() {
      const ok = await checkApiHealth();
      if (mounted) setIsApiOnline(ok);
    }
    ping();
    const interval = setInterval(ping, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    { label: "Início", href: "/", icon: <HomeIcon className="w-4 h-4" />, color: "#2563eb" },
    { label: "Jogos", href: "/games", icon: <GameIcon className="w-4 h-4" />, color: "#2563eb" },
    { label: "Filmes", href: "/movies", icon: <FilmIcon className="w-4 h-4" />, color: "#e11d48" },
    { label: "Séries", href: "/series", icon: <TvIcon className="w-4 h-4" />, color: "#7c3aed" },
    { label: "Livros", href: "/books", icon: <BookIcon className="w-4 h-4" />, color: "#d97706" },
    { label: "Músicas", href: "/musics", icon: <MusicIcon className="w-4 h-4" />, color: "#22c55e" },
  ];

  // identificar o item atual e pegar a cor correspondente
  const activeItem = navItems.find((item) => item.href === pathname);
  // definindo cor ativa e uma padrão caso para telas que não tem uma cor específica ainda
  const currentColor = activeItem ? activeItem.color : "2563eb"

  return (
    <header className="sticky top-0 z-50 bg-white/98 border-b border-slate-200/90 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-15 flex items-center justify-between gap-4">
        {/* Logo com cor sendo alterada de acordo com a cor principal dos elementos da tela*/}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transition-all duration-500 ease-in-out group-hover:scale-105"
          style={{
            backgroundColor: currentColor,
            boxShadow: `0 1px 2px 0 ${currentColor}40`
          }}
          >
            <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
              <path d="M21 6H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1z" />
            </svg>
          </div>
          <div>
            <span
              className="font-black text-sm tracking-tight text-slate-900"
              style={{ fontFamily: "var(--font-orbitron), monospace" }}
            >
              CATÁLOGO
            </span>{" "}
            {/* Geek sendo alterado da mesma forma que a logo */}
            <span
              className="font-black text-sm tracking-tight transition-colors duration-500 ease-in-out"
              style={{
                fontFamily: "var(--font-orbitron), monospace",
                color: currentColor
              }}
            >
              GEEK
            </span>
          </div>
        </Link>

        {/* Links Centrais (Desktop) */}
        <nav className="hidden md:flex items-center gap-1.5 flex-1 justify-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  isActive
                    ? "shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
                style={{
                  fontFamily: "var(--font-rajdhani), sans-serif",
                  background: isActive ? `${item.color}15` : "transparent",
                  border: `1px solid ${isActive ? `${item.color}40` : "transparent"}`,
                  color: isActive ? item.color : undefined,
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Ações da Direita: Status da API & Docs */}
        <div className="flex items-center gap-2">
          {/* Badge de Status da API Django */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-slate-100 border border-slate-200 text-slate-600"
            title={
              isApiOnline === null
                ? "Verificando API..."
                : isApiOnline
                ? "API Django Ninja Conectada"
                : "API Django Ninja Offline (inicie o backend na porta 8000)"
            }
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isApiOnline === null
                  ? "bg-amber-400 animate-pulse"
                  : isApiOnline
                  ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                  : "bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.5)]"
              }`}
            />
            <span
              className="hidden sm:inline text-[11px] font-bold"
              style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
            >
              API {isApiOnline ? "ON" : isApiOnline === false ? "OFF" : "..."}
            </span>
          </div>

          {/* Link Scalar Docs */}
          <a
            href="http://127.0.0.1:8000/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
          >
            <span>Docs</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Navegação Mobile (Horizontal Scroll) */}
      <div className="md:hidden flex gap-1.5 px-4 pb-2.5 overflow-x-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0"
              style={{
                fontFamily: "var(--font-rajdhani), sans-serif",
                background: isActive ? `${item.color}15` : "#f1f5f9",
                border: `1px solid ${isActive ? `${item.color}40` : "#e2e8f0"}`,
                color: isActive ? item.color : "#475569",
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
