"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UNSPLASH, getGameCover } from "@/lib/catalogData";
import { GameIcon, FilmIcon, TvIcon, BookIcon, MusicIcon } from "@/components/MediaIcons";
import MediaCard, { MediaCardItem } from "@/components/MediaCard";
import ReviewModal, { MediaType, ReviewItemTarget } from "@/components/ReviewModal";
import { getGames, getMovies, getSeries, getBooks, getMusics } from "@/lib/api";
import { Game, Movie, Serie, Book, Music } from "@/types/game";

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [musics, setMusics] = useState<Music[]>([]);
  const [selectedReviewTarget, setSelectedReviewTarget] = useState<{
    item: ReviewItemTarget;
    mediaType: MediaType;
    accentColor: string;
  } | null>(null);

  async function loadAllData() {
    try {
      const [g, m, s, b, mu] = await Promise.all([
        getGames().catch(() => []),
        getMovies().catch(() => []),
        getSeries().catch(() => []),
        getBooks().catch(() => []),
        getMusics().catch(() => []),
      ]);
      setGames(g);
      setMovies(m);
      setSeries(s);
      setBooks(b);
      setMusics(mu);
    } catch {
      // Ignora falhas pontuais
    }
  }

  useEffect(() => {
    loadAllData();
  }, []);

  const categories = [
    {
      key: "jogos",
      label: "Jogos",
      count: games.length,
      icon: <GameIcon className="w-5 h-5" />,
      color: "#2563eb",
      img: UNSPLASH.gaming,
      href: "/games",
    },
    {
      key: "filmes",
      label: "Filmes",
      count: movies.length,
      icon: <FilmIcon className="w-5 h-5" />,
      color: "#e11d48",
      img: UNSPLASH.cinema,
      href: "/movies",
    },
    {
      key: "series",
      label: "Séries",
      count: series.length,
      icon: <TvIcon className="w-5 h-5" />,
      color: "#7c3aed",
      img: UNSPLASH.netflix,
      href: "/series",
    },
    {
      key: "livros",
      label: "Livros",
      count: books.length,
      icon: <BookIcon className="w-5 h-5" />,
      color: "#d97706",
      img: UNSPLASH.library,
      href: "/books",
    },
    {
      key: "musicas",
      label: "Músicas",
      count: musics.length,
      icon: <MusicIcon className="w-5 h-5" />,
      color: "#22c55e",
      img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=500&fit=crop",
      href: "/musics",
    },
  ];

  interface HighlightTarget {
    card: MediaCardItem;
    item: ReviewItemTarget;
    mediaType: MediaType;
    accentColor: string;
  }

  // Converte itens dos 5 universos do banco Neon para MediaCards de destaque
  const highlightTargets: HighlightTarget[] = [
    ...games.slice(0, 2).map((g) => ({
      card: {
        id: g.id,
        title: g.name,
        genre: [g.type, ...(g.genre ? [g.genre] : [])],
        desc: g.description,
        rating: g.average_rating,
        reviews: g.review_count,
        img: g.cover_url || getGameCover(g.name, g.type),
        images: g.images && g.images.length > 0 ? g.images : undefined,
        platforms: g.platforms,
      },
      item: g,
      mediaType: "games" as MediaType,
      accentColor: "#2563eb",
    })),
    ...movies.slice(0, 1).map((m) => ({
      card: {
        id: m.id,
        title: m.name,
        genre: [m.type, ...(m.genre ? [m.genre] : [])],
        desc: m.description,
        rating: m.average_rating,
        reviews: m.review_count,
        img: m.cover_url || "https://images.unsplash.com/photo-1650475958723-e8d850c26f67?w=800&h=500&fit=crop",
        images: m.images && m.images.length > 0 ? m.images : undefined,
        platforms: m.platforms,
      },
      item: m,
      mediaType: "movies" as MediaType,
      accentColor: "#e11d48",
    })),
    ...series.slice(0, 1).map((s) => ({
      card: {
        id: s.id,
        title: s.name,
        genre: [s.type, ...(s.genre ? [s.genre] : [])],
        desc: s.description,
        rating: s.average_rating,
        reviews: s.review_count,
        img: s.cover_url || "https://images.unsplash.com/photo-1643208589889-0735ad7218f0?w=800&h=500&fit=crop",
        images: s.images && s.images.length > 0 ? s.images : undefined,
        platforms: s.platforms,
      },
      item: s,
      mediaType: "series" as MediaType,
      accentColor: "#7c3aed",
    })),
    ...books.slice(0, 1).map((b) => ({
      card: {
        id: b.id,
        title: b.name,
        genre: [b.type, ...(b.genre ? [b.genre] : [])],
        desc: b.description,
        rating: b.average_rating,
        reviews: b.review_count,
        img: b.cover_url || "https://images.unsplash.com/photo-1535905496755-26ae35d0ae54?w=800&h=500&fit=crop",
        images: b.images && b.images.length > 0 ? b.images : undefined,
        platforms: b.platforms,
      },
      item: b,
      mediaType: "books" as MediaType,
      accentColor: "#d97706",
    })),
    ...musics.slice(0, 1).map((mu) => ({
      card: {
        id: mu.id,
        title: mu.name,
        genre: [mu.type, ...(mu.genre ? [mu.genre] : [])],
        desc: mu.description,
        rating: mu.average_rating,
        reviews: mu.review_count,
        img: mu.cover_url || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=500&fit=crop",
        images: mu.images && mu.images.length > 0 ? mu.images : undefined,
        platforms: mu.platforms,
      },
      item: mu,
      mediaType: "musics" as MediaType,
      accentColor: "#22c55e",
    })),
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-gradient relative grid-bg overflow-hidden border-b border-slate-200/80">
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-14 md:py-20 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-flex items-center gap-2 badge-primary px-3 py-1.5 rounded-full text-xs font-bold mb-4 shadow-xs">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 6H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1zm-7 9H7v-2h7v2zm3-4H7V9h10v2z" />
              </svg>
              Conectado ao Neon PostgreSQL
            </span>

            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-black leading-none mb-4 text-slate-950 tracking-tight"
              style={{ fontFamily: "var(--font-orbitron), monospace" }}
            >
              SEU HUB<br />
              <span className="text-blue-600">COMPLETO</span><br />
              DE GEEK
            </h1>

            <p className="text-base md:text-lg mb-8 max-w-md mx-auto md:mx-0 text-slate-600 leading-relaxed font-normal">
              Catálogo sincronizado com banco de dados em nuvem. Jogos, filmes, séries e livros em alta performance.
            </p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link
                href="/games"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/25 transition-all hover:scale-105"
                style={{
                  fontFamily: "var(--font-rajdhani), sans-serif",
                  fontSize: "1rem",
                }}
              >
                <GameIcon className="w-5 h-5" />
                <span>Explorar Jogos →</span>
              </Link>

              <Link
                href="/movies"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all hover:scale-105"
                style={{
                  fontFamily: "var(--font-rajdhani), sans-serif",
                  fontSize: "1rem",
                }}
              >
                <FilmIcon className="w-5 h-5" />
                <span>Ver Filmes</span>
              </Link>
            </div>
          </div>

          <div className="flex-1 hidden md:block">
            <div className="relative">
              <img
                src={UNSPLASH.hero}
                alt="Gamer em setup moderno"
                className="w-full h-64 object-cover rounded-2xl border border-slate-200 shadow-xl"
                loading="lazy"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl overflow-hidden border-2 border-blue-600 shadow-lg">
                <img
                  src={UNSPLASH.arcades}
                  alt="Arcades retrô"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar conectada ao Neon */}
      <section className="py-5 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all block"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${cat.color}15`, color: cat.color }}
              >
                {cat.icon}
              </div>
              <div>
                <div
                  className="text-2xl font-black leading-none"
                  style={{ fontFamily: "var(--font-orbitron), monospace", color: cat.color }}
                >
                  {cat.count}
                </div>
                <div
                  className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5"
                  style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
                >
                  {cat.label}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Category Cards Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2
          className="text-2xl font-bold mb-6 text-slate-900 clip-accent"
          style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
        >
          Módulos do Catálogo
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="card-hover relative rounded-2xl overflow-hidden h-44 text-left group block border border-slate-200 bg-white shadow-xs"
            >
              <img
                src={cat.img}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="img-overlay absolute inset-0" />
              <div className="absolute inset-0 p-4 flex flex-col justify-end z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ color: cat.color }}>{cat.icon}</span>
                  <span
                    className="text-xl font-bold text-white tracking-wide"
                    style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
                  >
                    {cat.label}
                  </span>
                </div>
                <span className="text-xs text-white/80 font-medium">
                  {cat.count} títulos cadastrados no banco
                </span>
              </div>
              <div
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full text-white shadow-sm"
                style={{ background: cat.color, width: 28, height: 28 }}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Highlights Section */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-2xl font-bold text-slate-900 clip-accent"
            style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
          >
            Destaques do Catálogo
          </h2>

          <Link
            href="/games"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
            style={{ fontFamily: "var(--font-rajdhani), sans-serif" }}
          >
            Ver todos os jogos &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {highlightTargets.map(({ card, item, mediaType, accentColor }) => (
            <MediaCard
              key={`${mediaType}-${card.id}-${card.title}`}
              item={card}
              accentColor={accentColor}
              onOpenReviews={() => {
                setSelectedReviewTarget({ item, mediaType, accentColor });
              }}
            />
          ))}
        </div>
      </section>

      {/* Modal de Reviews */}
      {selectedReviewTarget && (
        <ReviewModal
          item={selectedReviewTarget.item}
          mediaType={selectedReviewTarget.mediaType}
          accentColor={selectedReviewTarget.accentColor}
          isOpen={!!selectedReviewTarget}
          onClose={() => setSelectedReviewTarget(null)}
          onReviewChange={() => {
            loadAllData();
          }}
        />
      )}
    </main>
  );
}