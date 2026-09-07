from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Platform(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Serie(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    type = models.CharField(max_length=100)
    release_date = models.DateField(blank=True, null=True)
    genre = models.ForeignKey(
        Genre, on_delete=models.SET_NULL, null=True, blank=True, related_name="series"
    )
    platforms = models.ManyToManyField(Platform, blank=True, related_name="series")
    cover_url = models.TextField(blank=True, null=True)
    images = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.name


class Review(models.Model):
    serie = models.ForeignKey(Serie, on_delete=models.CASCADE, related_name="reviews")
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    author = models.CharField(max_length=100)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.serie.name} by {self.author} ({self.rating}/5)"
