import Link from "next/link";
import { GameIcon, FilmIcon, TvIcon, BookIcon, HomeIcon, MusicIcon } from "@/components/MediaIcons";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  const links = [
    { label: "Início", href: "/", icon: <HomeIcon className="w-4 h-4" />, color: "#2563eb" },
    { label: "Jogos", href: "/games", icon: <GameIcon className="w-4 h-4" />, color: "#2563eb" },
    { label: "Filmes", href: "/movies", icon: <FilmIcon className="w-4 h-4" />, color: "#e11d48" },
    { label: "Séries", href: "/series", icon: <TvIcon className="w-4 h-4" />, color: "#7c3aed" },
    { label: "Livros", href: "/books", icon: <BookIcon className="w-4 h-4" />, color: "#d97706" },
    { label: "Músicas", href: "/musics", icon: <MusicIcon className="w-4 h-4" />, color: "#22c55e" },
  ];

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      {/* Glow / Badge */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600/20 via-purple-600/20 to-rose-600/20 flex items-center justify-center border border-slate-200 shadow-sm mx-auto">
          <Compass className="w-12 h-12 text-blue-600 animate-pulse" />
        </div>
        <span
          className="absolute -bottom-2 -right-2 text-xs font-black px-2.5 py-1 rounded-full bg-rose-500 text-white shadow-md shadow-rose-500/30"
          style={{ fontFamily: "var(--font-orbitron), monospace" }}
        >
          404
        </span>
      </div>

      {/* Título Principal */}
      <h1
        className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-2"
        style={{ fontFamily: "var(--font-orbitron), monospace" }}
      >
        404
      </h1>

      <h2
        className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mb-2"
        style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
      >
        This page could not be found
      </h2>

      <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
        A página que você está procurando não existe, foi movida ou a rota informada é inválida. Explore uma das categorias do nosso catálogo abaixo:
      </p>

      {/* Botões de Categoria */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mb-10">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-all hover:scale-105"
            style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
          >
            <span style={{ color: item.color }}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Botão de Retorno */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:scale-105 active:scale-95 bg-blue-600 text-sm"
        style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para o Início</span>
      </Link>
    </main>
  );
}
