import { getGameCover } from "./catalogData";

interface CoverSearchResult {
  coverUrl: string;
  source: "steam" | "wikipedia" | "curated";
  additionalImages?: string[];
}

/**
 * Busca capa e screenshots de jogos na web automaticamente em segundo plano.
 * 1. Tenta Steam Store Search API (cobertura gigante para PC/Multiplataforma).
 * 2. Tenta Wikipedia PageImages API (excelente para exclusivos de console como Zelda, Mario).
 * 3. Faz fallback para catálogo de artes em alta definição curadas.
 */
export async function searchCoverFromWeb(
  title: string,
  type?: string
): Promise<CoverSearchResult> {
  const cleanTitle = title.trim();
  if (!cleanTitle) {
    return {
      coverUrl: getGameCover("", type),
      source: "curated",
    };
  }

  // 1. Tentar Steam API com timeout de 3.5s
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const steamUrl = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(
      cleanTitle
    )}&l=brazilian&cc=BR`;

    const res = await fetch(steamUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data?.items && data.items.length > 0) {
        const bestMatch = data.items[0];
        const appId = bestMatch.id;
        const headerImg = `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;
        const libraryImg = `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/library_600x900_2x.jpg`;

        return {
          coverUrl: headerImg,
          source: "steam",
          additionalImages: [libraryImg],
        };
      }
    }
  } catch {
    // Falha silenciosa no Steam, continua para o próximo
  }

  // 2. Tentar Wikipedia API com timeout de 3.5s
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      cleanTitle + " video game"
    )}&gsrlimit=3&prop=pageimages&format=json&pithumbsize=800&origin=*`;

    const res = await fetch(wikiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const pages = Object.values(data?.query?.pages || {});
      const withThumb = pages.find((p: unknown): p is { thumbnail: { source: string } } => {
        return typeof p === "object" && p !== null && "thumbnail" in p && typeof (p as { thumbnail: { source: string } }).thumbnail?.source === "string";
      });

      if (withThumb?.thumbnail?.source) {
        return {
          coverUrl: withThumb.thumbnail.source,
          source: "wikipedia",
        };
      }
    }
  } catch {
    // Falha silenciosa na Wikipedia
  }

  // 3. Fallback curado de alta definição
  return {
    coverUrl: getGameCover(cleanTitle, type),
    source: "curated",
  };
}
