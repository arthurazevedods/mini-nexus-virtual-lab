from django.urls import path
from . import views

urlpatterns = [
    path("ping/", views.ping, name="ping"),
    path("spaces/", views.list_spaces, name="list_spaces"),
    path("spaces/<slug:slug>/", views.space_detail, name="space_detail"),
]
