from django.db.models import Avg, Count
from django.shortcuts import get_object_or_404
from ninja import Router
from ninja.errors import HttpError

from .models import Book, Genre, Platform, Review
from .views import (
    BookCreateSchema,
    BookUpdateSchema,
    BookViewSchema,
    ReviewCreateSchema,
    ReviewUpdateSchema,
    ReviewViewSchema,
)

router = Router(tags=["Books"])


@router.post("/", response={201: BookViewSchema})
def create_book(request, data: BookCreateSchema):
    genre_obj = None
    if data.genre_name:
        genre_obj, _ = Genre.objects.get_or_create(name=data.genre_name.strip())

    book = Book.objects.create(
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
        book.platforms.set(platform_objs)

    return 201, book


@router.get("/", response=list[BookViewSchema])
def list_books(request, name: str | None = None, id: int | None = None):
    books = (
        Book.objects.select_related("genre")
        .prefetch_related("platforms")
        .annotate(average_rating=Avg("reviews__rating"), review_count=Count("reviews"))
    )
    if id is not None:
        books = books.filter(id=id)
    if name:
        books = books.filter(name__icontains=name)
    return books


@router.get("/{book_id}", response=BookViewSchema)
def get_book_by_id(request, book_id: int):
    return get_object_or_404(
        Book.objects.select_related("genre")
        .prefetch_related("platforms")
        .annotate(average_rating=Avg("reviews__rating"), review_count=Count("reviews")),
        id=book_id,
    )


@router.patch("/{book_id}", response=BookViewSchema)
def update_book(request, book_id: int, data: BookUpdateSchema):
    book = get_object_or_404(Book, id=book_id)
    update_data = data.dict(exclude_unset=True)

    if "genre_name" in update_data:
        genre_name = update_data.pop("genre_name")
        if genre_name:
            genre_obj, _ = Genre.objects.get_or_create(name=genre_name.strip())
            book.genre = genre_obj
        else:
            book.genre = None

    if "platforms" in update_data:
        platform_names = update_data.pop("platforms")
        if platform_names is not None:
            platform_objs = [
                Platform.objects.get_or_create(name=name.strip())[0]
                for name in platform_names
            ]
            book.platforms.set(platform_objs)

    for attr, value in update_data.items():
        setattr(book, attr, value)

    book.save()
    return book


@router.delete("/{book_id}", response={204: None})
def delete_book(request, book_id: int):
    book = get_object_or_404(Book, id=book_id)
    book.delete()
    return 204, None


@router.post("/{book_id}/reviews", response={201: ReviewViewSchema})
def create_review(request, book_id: int, data: ReviewCreateSchema):
    book = get_object_or_404(Book, id=book_id)

    review = Review.objects.create(
        book=book,
        author=data.author.strip(),
        rating=data.rating,
        comment=data.comment.strip() if data.comment else None,
    )
    return 201, review


@router.get("/{book_id}/reviews", response=list[ReviewViewSchema])
def list_reviews(request, book_id: int):
    book = get_object_or_404(Book, id=book_id)
    return book.reviews.all().order_by("-created_at")


@router.patch("/{book_id}/reviews/{review_id}", response=ReviewViewSchema)
def update_review(request, book_id: int, review_id: int, data: ReviewUpdateSchema):
    review = get_object_or_404(Review, id=review_id, book_id=book_id)
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


@router.delete("/{book_id}/reviews/{review_id}", response={204: None})
def delete_review(request, book_id: int, review_id: int):
    review = get_object_or_404(Review, id=review_id, book_id=book_id)
    review.delete()
    return 204, None
