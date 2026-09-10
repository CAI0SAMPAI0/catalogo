const STEAM_REDIRECT_DOMAINS = [
  "shared.cloudflare.steamstatic.com",
  "cdn.cloudflare.steamstatic.com",
  "steamcdn-a.akamaihd.net",
  "cdn.steamstatic.com",
];

/**
 * Normaliza URLs de imagens para evitar redirecionamentos 301,
 * garantir protocolo HTTPS e remover query strings malformadas duplicadas.
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  let clean = url.trim();
  if (!clean) return "";

  // URLs do TMDB geram 404 upstream no Next.js
  if (clean.includes("image.tmdb.org")) {
    return "";
  }

  // Upgrade http para https para evitar redirecionamentos 301
  if (clean.startsWith("http://")) {
    clean = "https://" + clean.slice(7);
  }

  // Substitui dominios Steam intermediarios pelo dominio canonico direto
  for (const domain of STEAM_REDIRECT_DOMAINS) {
    if (clean.includes(domain)) {
      clean = clean.replace(domain, "shared.steamstatic.com");
    }
  }

  // Corrige duplicacao de '?' (ex: ?w=1400...&auto=format?w=500...)
  if (clean.includes("?")) {
    const [base, ...rest] = clean.split("?");
    const query = rest.join("&");
    clean = `${base}?${query}`;
  }

  return clean;
}

