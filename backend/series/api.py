from django.db.models import Avg, Count
from django.shortcuts import get_object_or_404
from ninja import Router
from ninja.errors import HttpError

from .models import Serie, Genre, Platform, Review
from .views import (
    SerieCreateSchema,
    SerieUpdateSchema,
    SerieViewSchema,
    ReviewCreateSchema,
    ReviewUpdateSchema,
    ReviewViewSchema,
)

router = Router(tags=["Series"])


@router.post("/", response={201: SerieViewSchema})
def create_serie(request, data: SerieCreateSchema):
    genre_obj = None
    if data.genre_name:
        genre_obj, _ = Genre.objects.get_or_create(name=data.genre_name.strip())

    serie = Serie.objects.create(
        name=data.name,
        description=data.description,
        type=data.type,
        release_date=data.release_date,
        genre=genre_obj,
        cover_url=data.cover_url.strip() if data.cover_url else None,
        images=data.images or [],
    )

    if data.platforms:
        platform_objs = [
            Platform.objects.get_or_create(name=name.strip())[0]
            for name in data.platforms
        ]
        serie.platforms.set(platform_objs)

    return 201, serie


@router.get("/", response=list[SerieViewSchema])
def list_series(request, name: str | None = None, id: int | None = None):
    series = (
        Serie.objects.select_related("genre")
        .prefetch_related("platforms")
        .annotate(average_rating=Avg("reviews__rating"), review_count=Count("reviews"))
    )
    if id is not None:
        series = series.filter(id=id)
    if name:
        series = series.filter(name__icontains=name)
    return series


@router.get("/{serie_id}", response=SerieViewSchema)
def get_serie_by_id(request, serie_id: int):
    return get_object_or_404(
        Serie.objects.select_related("genre")
        .prefetch_related("platforms")
        .annotate(average_rating=Avg("reviews__rating"), review_count=Count("reviews")),
        id=serie_id,
    )


@router.patch("/{serie_id}", response=SerieViewSchema)
def update_serie(request, serie_id: int, data: SerieUpdateSchema):
    serie = get_object_or_404(Serie, id=serie_id)
    update_data = data.dict(exclude_unset=True)

    if "genre_name" in update_data:
        genre_name = update_data.pop("genre_name")
        if genre_name:
            genre_obj, _ = Genre.objects.get_or_create(name=genre_name.strip())
            serie.genre = genre_obj
        else:
            serie.genre = None

    if "platforms" in update_data:
        platform_names = update_data.pop("platforms")
        if platform_names is not None:
            platform_objs = [
                Platform.objects.get_or_create(name=name.strip())[0]
                for name in platform_names
            ]
            serie.platforms.set(platform_objs)

    for attr, value in update_data.items():
        setattr(serie, attr, value)

    serie.save()
    return serie


@router.delete("/{serie_id}", response={204: None})
def delete_serie(request, serie_id: int):
    serie = get_object_or_404(Serie, id=serie_id)
    serie.delete()
    return 204, None


@router.post("/{serie_id}/reviews", response={201: ReviewViewSchema})
def create_review(request, serie_id: int, data: ReviewCreateSchema):
    serie = get_object_or_404(Serie, id=serie_id)

    review = Review.objects.create(
        serie=serie,
        author=data.author.strip(),
        rating=data.rating,
        comment=data.comment.strip() if data.comment else None,
    )
    return 201, review


@router.get("/{serie_id}/reviews", response=list[ReviewViewSchema])
def list_reviews(request, serie_id: int):
    serie = get_object_or_404(Serie, id=serie_id)
    return serie.reviews.all().order_by("-created_at")


@router.patch("/{serie_id}/reviews/{review_id}", response=ReviewViewSchema)
def update_review(request, serie_id: int, review_id: int, data: ReviewUpdateSchema):
    review = get_object_or_404(Review, id=review_id, serie_id=serie_id)
    update_data = data.dict(exclude_unset=True)

    if "rating" in update_data:
        rating = update_data["rating"]
        if rating is None or rating < 1 or rating > 5:
            raise HttpError(400, "A nota deve estar entre 1 e 5.")

    if "comment" in update_data and update_data["comment"]:
        update_data["comment"] = update_data["comment"].strip()

    for attr, value in update_data.items():
        setattr(review, attr, value)

    review.save()
    return review


@router.delete("/{serie_id}/reviews/{review_id}", response={204: None})
def delete_review(request, serie_id: int, review_id: int):
    review = get_object_or_404(Review, id=review_id, serie_id=serie_id)
    review.delete()
    return 204, None
