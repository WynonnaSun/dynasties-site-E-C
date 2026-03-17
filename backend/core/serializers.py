from __future__ import annotations

from rest_framework import serializers

from .models import ImageItem, ImageSection


class ImageItemOutSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ImageItem
        fields = ["id", "image_url", "alt_text", "link_url", "sort_order"]

    def get_image_url(self, obj: ImageItem) -> str:
        request = self.context.get("request")
        if not obj.image:
            return ""
        # If the request is available, build an absolute URI; otherwise, return the relative URL.
        return request.build_absolute_uri(obj.image.url) if request else obj.image.url


class ImageSectionOutSerializer(serializers.Serializer):
    locale = serializers.CharField()
    section_key = serializers.CharField()
    images = ImageItemOutSerializer(many=True)