from datetime import date

from ninja import Field, Schema
from pydantic import field_validator


from core.image_utils import normalize_image_url


class BookCreateSchema(Schema):
    name: str = Field(..., min_length=1, max_length=200, description="Nome do livro")
    description: str | None = None
    type: str = Field(
        ..., min_length=1, max_length=100, description="Tipo/Gênero do livro"
    )
    release_date: date | None = None
    genre_name: str | None = None
    platforms: list[str] | None = None
    cover_url: str | None = None
    images: list[str] | None = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        if not value.strip():
            raise ValueError(
                "O nome do livro não pode ser vazio ou conter apenas espaços."
            )
        return value.strip()

    @field_validator("release_date")
    @classmethod
    def validate_release_date(cls, value: date | None) -> date | None:
        if value and value > date.today():
            raise ValueError("A data de lançamento não pode estar no futuro.")
        return value


class BookViewSchema(Schema):
    id: int
    name: str
    description: str | None = None
    type: str
    release_date: date | None = None
    genre: str | None = None
    platforms: list[str] = []
    cover_url: str | None = None
    images: list[str] = []
    average_rating: float | None = None
    review_count: int = 0

    @staticmethod
    def resolve_genre(obj):
        return obj.genre.name if obj.genre else None

    @staticmethod
    def resolve_platforms(obj):
        return [p.name for p in obj.platforms.all()]

    @staticmethod
    def resolve_cover_url(obj):
        return normalize_image_url(obj.cover_url)

    @staticmethod
    def resolve_images(obj):
        if not obj.images:
            return []
        normalized = [normalize_image_url(img) for img in obj.images if img]
        return [img for img in normalized if img]

    @staticmethod
    def resolve_average_rating(obj):
        avg = getattr(obj, "average_rating", None)
        return avg if avg is not None else None

    @staticmethod
    def resolve_review_count(obj):
        return getattr(obj, "review_count", 0)


class BookUpdateSchema(Schema):
    name: str | None = None
    description: str | None = None
    type: str | None = None
    release_date: date | None = None
    genre_name: str | None = None
    platforms: list[str] | None = None
    cover_url: str | None = None
    images: list[str] | None = None



class ReviewCreateSchema(Schema):
    author: str = Field(
        ..., min_length=2, max_length=100, description="Nome do autor da avaliação"
    )
    rating: int = Field(
        ..., ge=1, le=5, description="Nota de 1 a 5 estrelas", examples=[5]
    )
    comment: str | None = Field(
        None, max_length=500, description="Comentário opcional sobre o livro"
    )

    @field_validator("author")
    @classmethod
    def validate_author(cls, value: str) -> str:
        if not value.strip():
            raise ValueError(
                "O nome do autor não pode ser vazio ou conter apenas espaços."
            )
        return value.strip()


class ReviewViewSchema(Schema):
    id: int
    author: str
    rating: int
    comment: str | None = None
    created_at: str

    @staticmethod
    def resolve_created_at(obj):
        return obj.created_at.isoformat()


class ReviewUpdateSchema(Schema):
    rating: int | None = Field(None, ge=1, le=5, description="Nova nota de 1 a 5")
    comment: str | None = Field(None, max_length=500, description="Novo comentário")
