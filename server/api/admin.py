from django.contrib import admin
from .models import Space


@admin.register(Space)
class SpaceAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug")
    prepopulated_fields = {"slug": ("name",)}
