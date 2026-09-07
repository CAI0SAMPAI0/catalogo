import {
  Game,
  GameCreateInput,
  GameUpdateInput,
  Movie,
  MovieCreateInput,
  Serie,
  SerieCreateInput,
  Book,
  BookCreateInput,
  Review,
  ReviewCreateInput,
} from "@/types/game";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

/**
 * Utilitário central de requisições com tratamento de erro padronizado.
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 204) {
      return null as T;
    }

    if (!res.ok) {
      let errorMessage = `Erro HTTP ${res.status}: ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail
              .map((d: { msg?: string; message?: string }) => d.msg || d.message)
              .join(", ");
          } else {
            errorMessage = String(errorData.detail);
          }
        }
      } catch {
        // Ignora se não for JSON válido
      }
      throw new Error(errorMessage);
    }

    return await res.json();
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Falha na comunicação com o servidor.");
  }
}

/* ==================== GAMES API ==================== */

export async function getGames(search?: string): Promise<Game[]> {
  const query = search ? `?name=${encodeURIComponent(search.trim())}` : "";
  return request<Game[]>(`/games/${query}`);
}

export async function getGameById(id: number): Promise<Game> {
  return request<Game>(`/games/${id}`);
}

export async function createGame(data: GameCreateInput): Promise<Game> {
  return request<Game>("/games/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateGame(id: number, data: GameUpdateInput): Promise<Game> {
  return request<Game>(`/games/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteGame(id: number): Promise<void> {
  return request<void>(`/games/${id}`, {
    method: "DELETE",
  });
}

export async function getReviews(gameId: number): Promise<Review[]> {
  return request<Review[]>(`/games/${gameId}/reviews`);
}

export async function createReview(gameId: number, data: ReviewCreateInput): Promise<Review> {
  return request<Review>(`/games/${gameId}/reviews`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteReview(gameId: number, reviewId: number): Promise<void> {
  return request<void>(`/games/${gameId}/reviews/${reviewId}`, {
    method: "DELETE",
  });
}

/* ==================== MOVIES API ==================== */

export async function getMovies(search?: string): Promise<Movie[]> {
  const query = search ? `?name=${encodeURIComponent(search.trim())}` : "";
  return request<Movie[]>(`/movies/${query}`);
}

export async function createMovie(data: MovieCreateInput): Promise<Movie> {
  return request<Movie>("/movies/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteMovie(id: number): Promise<void> {
  return request<void>(`/movies/${id}`, {
    method: "DELETE",
  });
}

export async function getMovieReviews(movieId: number): Promise<Review[]> {
  return request<Review[]>(`/movies/${movieId}/reviews`);
}

export async function createMovieReview(movieId: number, data: ReviewCreateInput): Promise<Review> {
  return request<Review>(`/movies/${movieId}/reviews`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteMovieReview(movieId: number, reviewId: number): Promise<void> {
  return request<void>(`/movies/${movieId}/reviews/${reviewId}`, {
    method: "DELETE",
  });
}

/* ==================== SERIES API ==================== */

export async function getSeries(search?: string): Promise<Serie[]> {
  const query = search ? `?name=${encodeURIComponent(search.trim())}` : "";
  return request<Serie[]>(`/series/${query}`);
}

export async function createSerie(data: SerieCreateInput): Promise<Serie> {
  return request<Serie>("/series/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteSerie(id: number): Promise<void> {
  return request<void>(`/series/${id}`, {
    method: "DELETE",
  });
}

export async function getSerieReviews(serieId: number): Promise<Review[]> {
  return request<Review[]>(`/series/${serieId}/reviews`);
}

export async function createSerieReview(serieId: number, data: ReviewCreateInput): Promise<Review> {
  return request<Review>(`/series/${serieId}/reviews`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteSerieReview(serieId: number, reviewId: number): Promise<void> {
  return request<void>(`/series/${serieId}/reviews/${reviewId}`, {
    method: "DELETE",
  });
}

/* ==================== BOOKS API ==================== */

export async function getBooks(search?: string): Promise<Book[]> {
  const query = search ? `?name=${encodeURIComponent(search.trim())}` : "";
  return request<Book[]>(`/books/${query}`);
}

export async function createBook(data: BookCreateInput): Promise<Book> {
  return request<Book>("/books/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteBook(id: number): Promise<void> {
  return request<void>(`/books/${id}`, {
    method: "DELETE",
  });
}

export async function getBookReviews(bookId: number): Promise<Review[]> {
  return request<Review[]>(`/books/${bookId}/reviews`);
}

export async function createBookReview(bookId: number, data: ReviewCreateInput): Promise<Review> {
  return request<Review>(`/books/${bookId}/reviews`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteBookReview(bookId: number, reviewId: number): Promise<void> {
  return request<void>(`/books/${bookId}/reviews/${reviewId}`, {
    method: "DELETE",
  });
}

/* ==================== HEALTH CHECK ==================== */

export async function checkApiHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_BASE_URL}/games/`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    return false;
  }
}
