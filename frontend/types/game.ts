/**
 * Interfaces TypeScript para o Catálogo de Jogos, Filmes, Séries e Livros.
 * Espelham exatamente os schemas Pydantic definidos no backend Django Ninja.
 */

export interface Game {
  id: number;
  name: string;
  description: string | null;
  type: string;
  release_date: string | null; // ISO string 'YYYY-MM-DD'
  genre: string | null;
  platforms: string[];
  cover_url?: string | null;
  images: string[];
  average_rating: number | null;
  review_count: number;
}

export interface GameCreateInput {
  name: string;
  description?: string;
  type: string;
  release_date?: string;
  genre_name?: string;
  platforms?: string[];
  cover_url?: string;
  images?: string[];
}

export interface GameUpdateInput {
  name?: string;
  description?: string;
  type?: string;
  release_date?: string;
  genre_name?: string;
  platforms?: string[];
  cover_url?: string;
  images?: string[];
}

export interface Review {
  id: number;
  author: string;
  rating: number; // 1 a 5
  comment: string | null;
  created_at: string; // ISO 8601
}

export interface ReviewCreateInput {
  author: string;
  rating: number;
  comment?: string;
}

// Aliases para Filmes, Séries e Livros que compartilham a mesma estrutura
export type Movie = Game;
export type MovieCreateInput = GameCreateInput;
export type Serie = Game;
export type SerieCreateInput = GameCreateInput;
export type Book = Game;
export type BookCreateInput = GameCreateInput;
export type Music = Game;
export type MusicCreateInput = GameCreateInput;
