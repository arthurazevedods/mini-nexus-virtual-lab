from django.urls import path
from . import views

urlpatterns = [
    path("ping/", views.ping),
    path("spaces/", views.list_spaces),
    path("spaces/<slug:slug>/", views.space_detail),

    path("auth/csrf/", views.csrf),
    path("auth/login/", views.login_view),
    path("auth/logout/", views.logout_view),
    path("auth/me/", views.me_view),
]
