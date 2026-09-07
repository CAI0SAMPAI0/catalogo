from django.db.models import Avg, Count
from django.shortcuts import get_object_or_404
from ninja import Router
from ninja.errors import HttpError

from .models import Movie, Genre, Platform, Review
from .views import (
    MovieCreateSchema,
    MovieUpdateSchema,
    MovieViewSchema,
    ReviewCreateSchema,
    ReviewUpdateSchema,
    ReviewViewSchema,
)

router = Router(tags=["Movies"])


@router.post("/", response={201: MovieViewSchema})
def create_movie(request, data: MovieCreateSchema):
    genre_obj = None
    if data.genre_name:
        genre_obj, _ = Genre.objects.get_or_create(name=data.genre_name.strip())

    movie = Movie.objects.create(
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
        movie.platforms.set(platform_objs)

    return 201, movie


@router.get("/", response=list[MovieViewSchema])
def list_movies(request, name: str | None = None, id: int | None = None):
    movies = (
        Movie.objects.select_related("genre")
        .prefetch_related("platforms")
        .annotate(average_rating=Avg("reviews__rating"), review_count=Count("reviews"))
    )
    if id is not None:
        movies = movies.filter(id=id)
    if name:
        movies = movies.filter(name__icontains=name)
    return movies


@router.get("/{movie_id}", response=MovieViewSchema)
def get_movie_by_id(request, movie_id: int):
    return get_object_or_404(
        Movie.objects.select_related("genre")
        .prefetch_related("platforms")
        .annotate(average_rating=Avg("reviews__rating"), review_count=Count("reviews")),
        id=movie_id,
    )


@router.patch("/{movie_id}", response=MovieViewSchema)
def update_movie(request, movie_id: int, data: MovieUpdateSchema):
    movie = get_object_or_404(Movie, id=movie_id)
    update_data = data.dict(exclude_unset=True)

    if "genre_name" in update_data:
        genre_name = update_data.pop("genre_name")
        if genre_name:
            genre_obj, _ = Genre.objects.get_or_create(name=genre_name.strip())
            movie.genre = genre_obj
        else:
            movie.genre = None

    if "platforms" in update_data:
        platform_names = update_data.pop("platforms")
        if platform_names is not None:
            platform_objs = [
                Platform.objects.get_or_create(name=name.strip())[0]
                for name in platform_names
            ]
            movie.platforms.set(platform_objs)

    for attr, value in update_data.items():
        setattr(movie, attr, value)

    movie.save()
    return movie


@router.delete("/{movie_id}", response={204: None})
def delete_movie(request, movie_id: int):
    movie = get_object_or_404(Movie, id=movie_id)
    movie.delete()
    return 204, None


@router.post("/{movie_id}/reviews", response={201: ReviewViewSchema})
def create_review(request, movie_id: int, data: ReviewCreateSchema):
    movie = get_object_or_404(Movie, id=movie_id)

    review = Review.objects.create(
        movie=movie,
        author=data.author.strip(),
        rating=data.rating,
        comment=data.comment.strip() if data.comment else None,
    )
    return 201, review


@router.get("/{movie_id}/reviews", response=list[ReviewViewSchema])
def list_reviews(request, movie_id: int):
    movie = get_object_or_404(Movie, id=movie_id)
    return movie.reviews.all().order_by("-created_at")


@router.patch("/{movie_id}/reviews/{review_id}", response=ReviewViewSchema)
def update_review(request, movie_id: int, review_id: int, data: ReviewUpdateSchema):
    review = get_object_or_404(Review, id=review_id, movie_id=movie_id)
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


@router.delete("/{movie_id}/reviews/{review_id}", response={204: None})
def delete_review(request, movie_id: int, review_id: int):
    review = get_object_or_404(Review, id=review_id, movie_id=movie_id)
    review.delete()
    return 204, None
