from django.db.models import Avg, Count
from django.shortcuts import get_object_or_404
from ninja import Router
from ninja.errors import HttpError

from .models import Genre, Music, Platform, Review
from .views import (
    MusicCreateSchema,
    MusicUpdateSchema,
    MusicViewSchema,
    ReviewCreateSchema,
    ReviewUpdateSchema,
    ReviewViewSchema,
)

router = Router(tags=["Musics"])


@router.post("/", response={201: MusicViewSchema})
def create_music(request, data: MusicCreateSchema):
    genre_obj = None
    if data.genre_name:
        genre_obj, _ = Genre.objects.get_or_create(name=data.genre_name.strip())

    music = Music.objects.create(
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
        music.platforms.set(platform_objs)

    return 201, music


@router.get("/", response=list[MusicViewSchema])
def list_musics(request, name: str | None = None, id: int | None = None):
    musics = (
        Music.objects.select_related("genre")
        .prefetch_related("platforms")
        .annotate(average_rating=Avg("reviews__rating"), review_count=Count("reviews", distinct=True))
    )
    if id is not None:
        musics = musics.filter(id=id)
    if name:
        musics = musics.filter(name__icontains=name)
    return musics


@router.get("/{music_id}", response=MusicViewSchema)
def get_music_by_id(request, music_id: int):
    return get_object_or_404(
        Music.objects.select_related("genre")
        .prefetch_related("platforms")
        .annotate(average_rating=Avg("reviews__rating"), review_count=Count("reviews", distinct=True)),
        id=music_id,
    )


@router.patch("/{music_id}", response=MusicViewSchema)
def update_music(request, music_id: int, data: MusicUpdateSchema):
    music = get_object_or_404(Music, id=music_id)
    update_data = data.dict(exclude_unset=True)

    if "genre_name" in update_data:
        genre_name = update_data.pop("genre_name")
        if genre_name:
            genre_obj, _ = Genre.objects.get_or_create(name=genre_name.strip())
            music.genre = genre_obj
        else:
            music.genre = None

    if "platforms" in update_data:
        platform_names = update_data.pop("platforms")
        if platform_names is not None:
            platform_objs = [
                Platform.objects.get_or_create(name=name.strip())[0]
                for name in platform_names
            ]
            music.platforms.set(platform_objs)

    for attr, value in update_data.items():
        setattr(music, attr, value)

    music.save()
    return music


@router.delete("/{music_id}", response={204: None})
def delete_music(request, music_id: int):
    music = get_object_or_404(Music, id=music_id)
    music.delete()
    return 204, None


@router.post("/{music_id}/reviews", response={201: ReviewViewSchema})
def create_review(request, music_id: int, data: ReviewCreateSchema):
    music = get_object_or_404(Music, id=music_id)

    review = Review.objects.create(
        music=music,
        author=data.author.strip(),
        rating=data.rating,
        comment=data.comment.strip() if data.comment else None,
    )
    return 201, review


@router.get("/{music_id}/reviews", response=list[ReviewViewSchema])
def list_reviews(request, music_id: int):
    music = get_object_or_404(Music, id=music_id)
    return music.reviews.all().order_by("-created_at")


@router.patch("/{music_id}/reviews/{review_id}", response=ReviewViewSchema)
def update_review(request, music_id: int, review_id: int, data: ReviewUpdateSchema):
    review = get_object_or_404(Review, id=review_id, music_id=music_id)
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


@router.delete("/{music_id}/reviews/{review_id}", response={204: None})
def delete_review(request, music_id: int, review_id: int):
    review = get_object_or_404(Review, id=review_id, music_id=music_id)
    review.delete()
    return 204, None
