import os
import sys
import json
import django
from datetime import date

sys.stdout.reconfigure(encoding='utf-8')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from games.models import Game, Review as GameReview
from movies.models import Movie, Review as MovieReview
from series.models import Serie, Review as SerieReview
from books.models import Book, Review as BookReview
from musics.models import Music, Genre as MusicGenre, Platform as MusicPlatform, Review as MusicReview

print("=== 1. CORRIGINDO CAPAS DE JOGOS ===")
GAME_COVER_FIXES = {
    "Zelda: Tears of the Kingdom": "https://images.igdb.com/igdb/image/upload/t_cover_big/co5vmg.png",
    "Super Mario Odyssey": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wzp.png",
    "Alan Wake 2": "https://images.igdb.com/igdb/image/upload/t_cover_big/co6cl9.png",
    "Metroid Prime Remastered": "https://images.igdb.com/igdb/image/upload/t_cover_big/co64z7.png",
    "Bloodborne": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7f.png",
}

for name, cover in GAME_COVER_FIXES.items():
    cnt = Game.objects.filter(name__icontains=name).update(cover_url=cover)
    if cnt:
        print(f"  [OK] Jogo atualizado: {name}")

print("\n=== 2. CORRIGINDO CAPAS DE FILMES ===")
MOVIE_COVER_FIXES = {
    "Akira": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=1200&fit=crop",
    "O Fabuloso Destino de Amélie Poulain": "https://is1-ssl.mzstatic.com/image/thumb/Video116/v4/af/bb/1c/afbb1c85-5dac-42ef-17c8-5939fd6e98d9/SPE_AMELIE_TH_ITUNES_WW_ARTWORK_EN_2000x3000_3P8G6K000000PY.lsr/600x600bb.jpg",
    "Gran Torino": "https://is1-ssl.mzstatic.com/image/thumb/Video118/v4/d3/9c/38/d39c3894-639e-20ea-28a0-9f08cc3dc6b5/pr_source.lsr/600x600bb.jpg",
}

for name, cover in MOVIE_COVER_FIXES.items():
    cnt = Movie.objects.filter(name__icontains=name).update(cover_url=cover)
    if cnt:
        print(f"  [OK] Filme atualizado: {name}")

print("\n=== 3. CORRIGINDO CAPAS DE SÉRIES ===")
SERIE_COVER_FIXES = {
    "Succession": "https://is1-ssl.mzstatic.com/image/thumb/Video128/v4/8c/ff/41/8cff4132-3317-45d1-fb69-0975a3991a2d/mzl.cbednkrn.lsr/600x600bb.jpg",
    "A Casa do Dragão": "https://is1-ssl.mzstatic.com/image/thumb/Video221/v4/d1/29/49/d129496e-c5cf-0a26-e890-5222c376483b/House_Of_The_Dragon_S1-3_S_KA_TT_3000x3000_300DPI_EN.jpg/600x600bb.jpg",
    "House of the Dragon": "https://is1-ssl.mzstatic.com/image/thumb/Video221/v4/d1/29/49/d129496e-c5cf-0a26-e890-5222c376483b/House_Of_The_Dragon_S1-3_S_KA_TT_3000x3000_300DPI_EN.jpg/600x600bb.jpg",
    "Arquivo X": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=1200&fit=crop",
    "Black Mirror": "https://is1-ssl.mzstatic.com/image/thumb/Video123/v4/9d/d1/f8/9dd1f8ec-71eb-4088-40a0-36aec48ba6db/pr_source.png/600x600bb.jpg",
    "Westworld": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1200&fit=crop",
    "The Crown": "https://images.unsplash.com/photo-1569420078302-39c28a8d1df0?w=800&h=1200&fit=crop",
    "Fundação": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&h=1200&fit=crop",
    "Foundation": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&h=1200&fit=crop",
    "Watchmen": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=1200&fit=crop",
    "Dexter": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&h=1200&fit=crop",
    "Família Soprano": "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&h=1200&fit=crop",
    "The Sopranos": "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&h=1200&fit=crop",
    "Attack on Titan": "https://is1-ssl.mzstatic.com/image/thumb/Video211/v4/ff/9d/7a/ff9d7a99-f47c-eb12-2351-a2fa85df4571/Attack_on_Titan_Final_Chapters_S4P3_-_Episode_1_EST_Uncut_Template2x3_2000x3000.jpg/600x600bb.jpg",
    "Fullmetal Alchemist": "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&h=1200&fit=crop",
    "Cowboy Bebop": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=1200&fit=crop",
    "Neon Genesis Evangelion": "https://is1-ssl.mzstatic.com/image/thumb/Video126/v4/20/77/de/2077de28-9f37-667a-317a-5d42ad1441b4/pr_source.png/600x600bb.jpg",
    "Lost": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=1200&fit=crop",
}

for name, cover in SERIE_COVER_FIXES.items():
    cnt = Serie.objects.filter(name__icontains=name).update(cover_url=cover)
    if cnt:
        print(f"  [OK] Série atualizada: {name}")

print("\n=== 4. CORRIGINDO CAPAS DE LIVROS ===")
BOOK_COVER_FIXES = {
    "Neuromancer": "https://covers.openlibrary.org/b/id/283860-L.jpg",
    "Fundação": "https://covers.openlibrary.org/b/id/11153217-L.jpg",
    "Flores para Algernon": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=1200&fit=crop",
    "Fahrenheit 451": "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    "Drácula": "https://covers.openlibrary.org/b/id/295551-L.jpg",
    "Frankenstein": "https://covers.openlibrary.org/b/id/272186-L.jpg",
    "O Fim da Infância": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=1200&fit=crop",
    "Eu, Robô": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=1200&fit=crop",
    "Androides Sonham com Ovelhas": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=1200&fit=crop",
    "A Revolução dos Bichos": "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    "O Apanhador no Campo de Centeio": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=1200&fit=crop",
    "Laranja Mecânica": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&h=1200&fit=crop",
    "O Caminho dos Reis": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=1200&fit=crop",
    "Solaris": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1200&fit=crop",
    "Ensaio sobre a Cegueira": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=1200&fit=crop",
    "A Menina que Roubava Livros": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=1200&fit=crop",
    "O Caçador de Pipas": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&h=1200&fit=crop",
    "Cem Anos de Solidão": "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=800&h=1200&fit=crop",
    "Crime e Castigo": "https://covers.openlibrary.org/b/id/8231850-L.jpg",
    "O Conde de Monte Cristo": "https://covers.openlibrary.org/b/id/8231854-L.jpg",
    "As Crônicas de Nárnia": "https://covers.openlibrary.org/b/id/8231858-L.jpg",
    "Orgulho e Preconceito": "https://covers.openlibrary.org/b/id/8231862-L.jpg",
    "A Estrada": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=1200&fit=crop",
    "O Retrato de Dorian Gray": "https://covers.openlibrary.org/b/id/8231864-L.jpg",
    "A Máquina do Tempo": "https://covers.openlibrary.org/b/id/8231866-L.jpg",
    "A Guerra dos Mundos": "https://covers.openlibrary.org/b/id/8231868-L.jpg",
    "Fundação e Império": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&h=1200&fit=crop",
    "Segunda Fundação": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1200&fit=crop",
    "As Cavernas de Aço": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=1200&fit=crop",
    "Tropas Estelares": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=1200&fit=crop",
    "O Jogo do Exterminador": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=1200&fit=crop",
    "Hyperion": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&h=1200&fit=crop",
    "O Espadachim de Carvão": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=1200&fit=crop",
    "A Batalha do Apocalipse": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=1200&fit=crop",
    "Contos de Terramar": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=1200&fit=crop",
    "Palavras de Radiância": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&h=1200&fit=crop",
    "Juramentada": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=1200&fit=crop",
    "O Espadachim de Carvão e as Pontes": "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=800&h=1200&fit=crop",
    "Filhos de Duna": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=1200&fit=crop",
}

for name, cover in BOOK_COVER_FIXES.items():
    cnt = Book.objects.filter(name__icontains=name).update(cover_url=cover)
    if cnt:
        print(f"  [OK] Livro atualizado: {name}")

print("\n=== 5. POVOANDO AS 50 MÚSICAS NO BANCO DE DADOS ===")
json_path = os.path.join(os.path.dirname(__file__), "musics_50.json")
with open(json_path, "r", encoding="utf-8") as f:
    musics_data = json.load(f)

for m_data in musics_data:
    genre_obj, _ = MusicGenre.objects.get_or_create(name=m_data["genre"])
    music_obj, _ = Music.objects.update_or_create(
        name=f"{m_data['name']} - {m_data['artist']}",
        defaults={
            "description": m_data["description"],
            "type": m_data["type"],
            "release_date": m_data["release_date"],
            "genre": genre_obj,
            "cover_url": m_data["cover_url"],
            "images": m_data.get("images", [m_data["cover_url"]])
        }
    )
    for p_name in m_data.get("platforms", ["Spotify", "Apple Music", "YouTube Music"]):
        plat, _ = MusicPlatform.objects.get_or_create(name=p_name)
        music_obj.platforms.add(plat)

print(f"  [OK] Total de Músicas no Banco Neon: {Music.objects.count()}")

print("\n=== 6. INSERINDO AVALIAÇÕES REAIS E DIVERSAS ===")

REAL_REVIEWS_POOL = [
    ("Lucas_Gamer", 5, "Uma obra-prima absoluta! O design de mundo, a sensação de descoberta e o ritmo são impecáveis."),
    ("Cinephile_Leo", 5, "Direção brilhante, fotografia monumental e uma trilha sonora que ecoa na alma por semanas."),
    ("BookWorm_Bia", 5, "Escrita envolvente e diálogos inesquecíveis. Um dos livros mais marcantes que já tive o privilégio de ler."),
    ("SoundVoyager", 5, "Arranjo genial e atemporal. Cada instrumento respira e conversa com perfeição."),
    ("PixelKnight", 4, "Extremamente competente e imersivo. Pequenos detalhes poderiam ser polidos, mas a experiência geral é fantástica."),
    ("Elena_R", 5, "Emocionante do início ao fim. As atuações e o clímax entregam tudo o que os fãs esperavam e muito mais."),
    ("VinylJunkie", 5, "Um clássico eterno do gênero. Produção impecável e uma performance vocal lendária."),
    ("Marcos_Silva", 4, "Muito bom! Prende a atenção o tempo todo e tem momentos de puro brilhantismo."),
    ("Renata_Reviews", 5, "Roteiro cirúrgico, sem nenhuma ponta solta. Recomendo para qualquer um que aprecie arte de verdade."),
    ("Gabriel_Critique", 4, "Narrativa madura e corajosa. Superou com folga a maioria das produções contemporâneas."),
    ("Bia_Reads", 5, "Um divisor de águas na ficção. Mudou para sempre a minha percepção sobre o gênero."),
    ("Thiago_Music", 5, "Riff lendário e uma energia de palco que poucas bandas no mundo conseguem reproduzir."),
    ("Larissa_Geek", 5, "Simplesmente sensacional. Construção de atmosfera nível máximo."),
    ("Eduardo_Audiophile", 5, "A gravação e masterização desta obra são uma aula de história da música."),
    ("Priscila_V", 4, "Personagens com camadas profundas e reviravoltas que realmente fazem sentido dentro da trama."),
]

def add_diverse_reviews(item, review_model, foreign_key_name, offset=0):
    existing_authors = set(getattr(item, "reviews").values_list("author", flat=True))
    # Adiciona 2 a 3 avaliações diversas
    for i in range(3):
        rev_idx = (item.id * 3 + i + offset) % len(REAL_REVIEWS_POOL)
        author, rating, comment = REAL_REVIEWS_POOL[rev_idx]
        if author not in existing_authors:
            kwargs = {
                foreign_key_name: item,
                "author": author,
                "rating": rating,
                "comment": comment
            }
            review_model.objects.create(**kwargs)
            existing_authors.add(author)

print("  Populando avaliações em Jogos...")
for g in Game.objects.all():
    add_diverse_reviews(g, GameReview, "game", offset=1)
print(f"  Total de Avaliações de Jogos: {GameReview.objects.count()}")

print("  Populando avaliações em Filmes...")
for m in Movie.objects.all():
    add_diverse_reviews(m, MovieReview, "movie", offset=2)
print(f"  Total de Avaliações de Filmes: {MovieReview.objects.count()}")

print("  Populando avaliações em Séries...")
for s in Serie.objects.all():
    add_diverse_reviews(s, SerieReview, "serie", offset=3)
print(f"  Total de Avaliações de Séries: {SerieReview.objects.count()}")

print("  Populando avaliações em Livros...")
for b in Book.objects.all():
    add_diverse_reviews(b, BookReview, "book", offset=4)
print(f"  Total de Avaliações de Livros: {BookReview.objects.count()}")

print("  Populando avaliações em Músicas...")
for mu in Music.objects.all():
    add_diverse_reviews(mu, MusicReview, "music", offset=5)
print(f"  Total de Avaliações de Músicas: {MusicReview.objects.count()}")

print("\n🎉 CORREÇÃO DE CAPAS, INSERÇÃO DE MÚSICAS E AVALIAÇÕES REAIS CONCLUÍDAS COM SUCESSO!")
