from __future__ import annotations

from django.db import models


class EmailRecord(models.Model):
    email = models.EmailField(unique=True)  
    name = models.CharField(max_length=100, blank=True, default="")
    message = models.CharField(max_length=1000, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.email


class ImageSection(models.Model):
    LOCALE_CHOICES = [
        ("en", "English"),
        ("zh", "Chinese"),
    ]

    key = models.CharField(max_length=64)  # e.g. "our_business"
    locale = models.CharField(max_length=2, choices=LOCALE_CHOICES)  # "en"/"zh"
    is_enabled = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["key", "locale"], name="uq_section_key_locale"),
        ]

    def __str__(self) -> str:
        return f"{self.key} ({self.locale})"


class ImageItem(models.Model):
    section = models.ForeignKey(
        ImageSection,
        on_delete=models.CASCADE,
        related_name="images",
    )

    # 这里是“真正上传图片”的关键：ImageField
    image = models.ImageField(upload_to="content/")

    alt_text = models.CharField(max_length=255, blank=True, default="")
    link_url = models.URLField(max_length=1000, blank=True, default="")

    is_hidden = models.BooleanField(default=False)
    sort_order = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["section", "sort_order"], name="idx_section_sort"),
        ]
        ordering = ["sort_order", "id"]  

    def __str__(self) -> str:
        return f"{self.section.key}:{self.id}"
