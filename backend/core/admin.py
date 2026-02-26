from __future__ import annotations

from django.contrib import admin
from django.utils.html import format_html

from .models import EmailRecord, ImageSection, ImageItem


@admin.register(EmailRecord)
class EmailRecordAdmin(admin.ModelAdmin):
    list_display = ("email", "name", "created_at")
    search_fields = ("email", "name")
    ordering = ("-created_at",)


class ImageItemInline(admin.TabularInline):
    model = ImageItem
    extra = 1
    fields = ("preview", "image", "alt_text", "link_url", "is_hidden", "sort_order")
    readonly_fields = ("preview",)
    ordering = ("sort_order", "id")

    def preview(self, obj: ImageItem):
        if not obj.pk or not obj.image:
            return "-"
        return format_html(
            '<img src="{}" style="height:60px;border-radius:6px;" />',
            obj.image.url,
        )

    preview.short_description = "Preview"


@admin.register(ImageSection)
class ImageSectionAdmin(admin.ModelAdmin):
    list_display = ("key", "locale", "is_enabled", "updated_at")
    list_filter = ("locale", "is_enabled")
    search_fields = ("key",)
    inlines = [ImageItemInline]