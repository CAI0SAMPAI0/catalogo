from django.db.models import Avg, Count
from django.shortcuts import get_object_or_404
from ninja import Router
from ninja.errors import HttpError

from .models import Game, Genre, Platform, Review
from .views import (
    GameCreateSchema,
    GameUpdateSchema,
    GameViewSchema,
    ReviewCreateSchema,
    ReviewUpdateSchema,
    ReviewViewSchema,
)

router = Router(tags=["Games"])


@router.post("/", response={201: GameViewSchema})
def create_game(request, data: GameCreateSchema):
    genre_obj = None
    if data.genre_name:
        genre_obj, _ = Genre.objects.get_or_create(name=data.genre_name.strip())

    game = Game.objects.create(
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
        game.platforms.set(platform_objs)

    return 201, game


@router.get("/", response=list[GameViewSchema])
def list_games(request, name: str | None = None, id: int | None = None):
    games = (
        Game.objects.select_related("genre")
        .prefetch_related("platforms")
        .annotate(average_rating=Avg("reviews__rating"), review_count=Count("reviews", distinct=True))
    )
    if id is not None:
        games = games.filter(id=id)
    if name:
        games = games.filter(name__icontains=name)
    return games


@router.get("/{game_id}", response=GameViewSchema)
def get_game_by_id(request, game_id: int):
    return get_object_or_404(
        Game.objects.select_related("genre")
        .prefetch_related("platforms")
        .annotate(average_rating=Avg("reviews__rating"), review_count=Count("reviews", distinct=True)),
        id=game_id,
    )


@router.patch("/{game_id}", response=GameViewSchema)
def update_game(request, game_id: int, data: GameUpdateSchema):
    game = get_object_or_404(Game, id=game_id)
    update_data = data.dict(exclude_unset=True)

    if "genre_name" in update_data:
        genre_name = update_data.pop("genre_name")
        if genre_name:
            genre_obj, _ = Genre.objects.get_or_create(name=genre_name.strip())
            game.genre = genre_obj
        else:
            game.genre = None

    if "platforms" in update_data:
        platform_names = update_data.pop("platforms")
        if platform_names is not None:
            platform_objs = [
                Platform.objects.get_or_create(name=name.strip())[0]
                for name in platform_names
            ]
            game.platforms.set(platform_objs)

    for attr, value in update_data.items():
        setattr(game, attr, value)

    game.save()
    return game


@router.delete("/{game_id}", response={204: None})
def delete_game(request, game_id: int):
    game = get_object_or_404(Game, id=game_id)
    game.delete()
    return 204, None


@router.post("/{game_id}/reviews", response={201: ReviewViewSchema})
def create_review(request, game_id: int, data: ReviewCreateSchema):
    game = get_object_or_404(Game, id=game_id)

    review = Review.objects.create(
        game=game,
        author=data.author.strip(),
        rating=data.rating,
        comment=data.comment.strip() if data.comment else None,
    )
    return 201, review


@router.get("/{game_id}/reviews", response=list[ReviewViewSchema])
def list_reviews(request, game_id: int):
    game = get_object_or_404(Game, id=game_id)
    return game.reviews.all().order_by("-created_at")


@router.patch("/{game_id}/reviews/{review_id}", response=ReviewViewSchema)
def update_review(request, game_id: int, review_id: int, data: ReviewUpdateSchema):
    review = get_object_or_404(Review, id=review_id, game_id=game_id)
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


@router.delete("/{game_id}/reviews/{review_id}", response={204: None})
def delete_review(request, game_id: int, review_id: int):
    review = get_object_or_404(Review, id=review_id, game_id=game_id)
    review.delete()
    return 204, None
