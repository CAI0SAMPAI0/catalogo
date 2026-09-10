from django.contrib import admin
from django.utils.html import format_html
from .models import Music, Genre, Platform, Review


class ReviewInline(admin.TabularInline):
    model = Review
    extra = 1
    fields = ("author", "rating", "comment", "created_at")
    readonly_fields = ("created_at",)


@admin.register(Music)
class MusicAdmin(admin.ModelAdmin):
    list_display = ("id", "cover_preview", "name", "type", "genre", "release_date")
    list_display_links = ("id", "name")
    list_filter = ("type", "genre", "platforms")
    search_fields = ("name", "description", "genre__name")
    filter_horizontal = ("platforms",)
    inlines = [ReviewInline]
    readonly_fields = ("cover_image_display",)

    fieldsets = (
        ("Informações Básicas", {
            "fields": ("name", "description", "type", "release_date", "genre", "platforms")
        }),
        ("Imagens & Mídia", {
            "fields": ("cover_url", "cover_image_display", "images")
        }),
    )

    def cover_preview(self, obj):
        if obj.cover_url:
            return format_html(
                '<img src="{}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px;" />',
                obj.cover_url
            )
        return "Sem capa"
    cover_preview.short_description = "Capa"

    def cover_image_display(self, obj):
        if obj.cover_url:
            return format_html(
                '<img src="{}" style="max-width: 300px; max-height: 300px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />',
                obj.cover_url
            )
        return "Nenhuma imagem cadastrada"
    cover_image_display.short_description = "Prévia da Capa"


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)


@admin.register(Platform)
class PlatformAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "music", "author", "rating", "created_at")
    list_filter = ("rating", "created_at")
    search_fields = ("author", "comment", "music__name")
