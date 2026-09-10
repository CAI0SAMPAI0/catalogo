from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI

from games.api import router as games_router
from series.api import router as series_router
from movies.api import router as movies_router
from books.api import router as books_router
from musics.api import router as musics_router

from .scalar import Scalar

api = NinjaAPI(
    title="Catálogo Geek API",
    version="1.0.0",
    description="API de alta performance para catálogo de Jogos, Filmes, Séries, Livros e Músicas com sistema de Avaliações.",
    docs=Scalar(),
)

api.add_router("/games", games_router)
api.add_router("/series", series_router)
api.add_router("/movies", movies_router)
api.add_router("/books", books_router)
api.add_router("/musics", musics_router)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),
]
