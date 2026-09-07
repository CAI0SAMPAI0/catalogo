export const UNSPLASH = {
  hero: "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=1400&h=700&fit=crop&auto=format",
  heroCyberpunk: "https://images.unsplash.com/photo-1672872476232-da16b45c9001?w=1400&h=700&fit=crop&auto=format",
  gaming: "https://images.unsplash.com/photo-1661347561879-c9ab77bac89f?w=800&h=500&fit=crop&auto=format",
  arcades: "https://images.unsplash.com/photo-1498736297812-3a08021f206f?w=800&h=500&fit=crop&auto=format",
  movie: "https://images.unsplash.com/photo-1688678004647-945d5aaf91c1?w=800&h=500&fit=crop&auto=format",
  popcorn: "https://images.unsplash.com/photo-1620177088258-c84147ee601f?w=800&h=500&fit=crop&auto=format",
  cinema: "https://images.unsplash.com/photo-1650475958723-e8d850c26f67?w=800&h=500&fit=crop&auto=format",
  books: "https://images.unsplash.com/photo-1535905496755-26ae35d0ae54?w=800&h=500&fit=crop&auto=format",
  library: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=800&h=500&fit=crop&auto=format",
  booksLed: "https://images.unsplash.com/photo-1517148892120-4d2da39c8dc1?w=800&h=500&fit=crop&auto=format",
  netflix: "https://images.unsplash.com/photo-1643208589889-0735ad7218f0?w=800&h=500&fit=crop&auto=format",
  tv: "https://images.unsplash.com/photo-1643208589884-1aa3a8a67b67?w=800&h=500&fit=crop&auto=format",
  controller: "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?w=800&h=500&fit=crop&auto=format",
  neon: "https://images.unsplash.com/photo-1548317202-26d94742e8d8?w=800&h=500&fit=crop&auto=format",
};



export const ALL_GENRES = {
  jogos: ["Todos", "RPG", "Aventura", "Soulslike", "Metroidvania", "Ação", "Plataforma"],
  filmes: ["Todos", "Sci-Fi", "Drama", "Ação", "Anime", "Neo-noir", "História"],
  series: ["Todos", "Drama", "Sci-Fi", "Animação", "Thriller", "Crime", "Terror"],
  livros: ["Todos", "Fantasia", "Sci-Fi", "Cyberpunk", "Distopia", "Épico"],
};

export function getGameCover(name: string, type?: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("elden")) return "https://images.unsplash.com/photo-1643489096329-ab168c1c8d14?w=500&h=300&fit=crop&auto=format";
  if (lower.includes("witcher")) return "https://images.unsplash.com/photo-1600998837340-4887228e311f?w=500&h=300&fit=crop&auto=format";
  if (lower.includes("zelda")) return UNSPLASH.heroCyberpunk + "?w=500&h=300&fit=crop";
  if (lower.includes("hollow")) return UNSPLASH.neon + "?w=500&h=300&fit=crop";
  if (lower.includes("cyberpunk")) return UNSPLASH.arcades + "?w=500&h=300&fit=crop";
  if (lower.includes("mario")) return "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&h=300&fit=crop&auto=format";
  if (lower.includes("god of war")) return UNSPLASH.gaming + "?w=500&h=300&fit=crop";
  
  if (type?.toLowerCase().includes("rpg")) return UNSPLASH.gaming + "?w=500&h=300&fit=crop";
  if (type?.toLowerCase().includes("soulslike")) return "https://images.unsplash.com/photo-1643489096329-ab168c1c8d14?w=500&h=300&fit=crop&auto=format";
  if (type?.toLowerCase().includes("metroidvania")) return UNSPLASH.neon + "?w=500&h=300&fit=crop";

  return UNSPLASH.controller + "?w=500&h=300&fit=crop";
}
