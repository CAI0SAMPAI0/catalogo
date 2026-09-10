import re

STEAM_REDIRECT_DOMAINS = [
    "shared.cloudflare.steamstatic.com",
    "cdn.cloudflare.steamstatic.com",
    "steamcdn-a.akamaihd.net",
    "cdn.steamstatic.com",
]

def normalize_image_url(url: str | None) -> str | None:
    if not url:
        return None
    url = str(url).strip()
    if not url:
        return None

    # URLs do TMDB nao cadastradas retornam 404 upstream no Next.js
    if "image.tmdb.org" in url:
        return None

    # Upgrade http para https para evitar redirecionamento 301
    if url.startswith("http://"):
        url = "https://" + url[7:]

    # Normalizar dominios Steam legados/Cloudflare para o dominio direto final HTTPS
    for domain in STEAM_REDIRECT_DOMAINS:
        if domain in url:
            url = url.replace(domain, "shared.steamstatic.com")

    # Corrigir URLs com multiplos '?' concatenados
    if "?" in url:
        base, query = url.split("?", 1)
        query = query.replace("?", "&")
        url = f"{base}?{query}"

    return url

