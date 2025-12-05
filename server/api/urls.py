from django.urls import path
from . import views

urlpatterns = [
    path("ping/", views.ping, name="ping"),
    path("spaces/", views.list_spaces, name="list_spaces"),
    path("spaces/<slug:slug>/", views.space_detail, name="space_detail"),

    # Auth
    path("auth/csrf/", views.csrf, name="csrf"),
    path("auth/login/", views.login_view, name="login"),
    path("auth/logout/", views.logout_view, name="logout"),
    path("auth/me/", views.me_view, name="me"),
]
