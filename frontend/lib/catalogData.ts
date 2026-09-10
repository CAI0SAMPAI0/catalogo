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
  if (lower.includes("zelda")) return UNSPLASH.heroCyberpunk;
  if (lower.includes("hollow")) return UNSPLASH.neon;
  if (lower.includes("cyberpunk")) return UNSPLASH.arcades;
  if (lower.includes("mario")) return "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&h=300&fit=crop&auto=format";
  if (lower.includes("god of war")) return UNSPLASH.gaming;

  if (type?.toLowerCase().includes("rpg")) return UNSPLASH.gaming;
  if (type?.toLowerCase().includes("soulslike")) return "https://images.unsplash.com/photo-1643489096329-ab168c1c8d14?w=500&h=300&fit=crop&auto=format";
  if (type?.toLowerCase().includes("metroidvania")) return UNSPLASH.neon;

  return UNSPLASH.controller;
}

export function getMovieCover(name: string, type?: string): string {
  const lower = name.toLowerCase();
  const t = (type || "").toLowerCase();
  if (lower.includes("duna") || lower.includes("dune")) return "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&h=1200&fit=crop";
  if (lower.includes("oppenheimer")) return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1200&fit=crop";
  if (lower.includes("interestelar")) return "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&h=1200&fit=crop";
  if (lower.includes("blade runner")) return UNSPLASH.heroCyberpunk;
  if (lower.includes("matrix")) return "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=1200&fit=crop";
  if (lower.includes("chihiro") || t.includes("anime")) return "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=1200&fit=crop";
  if (lower.includes("aranha") || lower.includes("spider")) return "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&h=1200&fit=crop";
  if (t.includes("sci-fi")) return UNSPLASH.heroCyberpunk;
  if (t.includes("ação")) return UNSPLASH.movie;
  return UNSPLASH.cinema;
}

export function getSerieCover(name: string, type?: string): string {
  const lower = name.toLowerCase();
  const t = (type || "").toLowerCase();
  if (lower.includes("breaking bad") || lower.includes("saul")) return "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&h=1200&fit=crop";
  if (lower.includes("arcane")) return UNSPLASH.neon;
  if (lower.includes("last of us")) return "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=1200&fit=crop";
  if (lower.includes("dark") || lower.includes("ruptura") || lower.includes("severance")) return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1200&fit=crop";
  if (lower.includes("xógum") || lower.includes("shogun")) return "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=1200&fit=crop";
  if (lower.includes("stranger")) return UNSPLASH.neon;
  if (t.includes("sci-fi")) return UNSPLASH.heroCyberpunk;
  if (t.includes("drama")) return UNSPLASH.netflix;
  return UNSPLASH.netflix;
}
