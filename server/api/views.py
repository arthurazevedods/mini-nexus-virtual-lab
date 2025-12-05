import json
from django.http import JsonResponse, Http404
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token

from .models import Space


#  Views de teste / espaços 

def ping(request):
    return JsonResponse({"message": "Mini Nexus Virtual Lab API is running 🚀"})


def list_spaces(request):
    spaces = Space.objects.all().order_by("id")
    data = [
        {
            "id": space.id,
            "name": space.name,
            "slug": space.slug,
            "description": space.description,
        }
        for space in spaces
    ]
    return JsonResponse({"spaces": data})


def space_detail(request, slug):
    try:
        space = Space.objects.get(slug=slug)
    except Space.DoesNotExist:
        raise Http404("Space not found")

    data = {
        "id": space.id,
        "name": space.name,
        "slug": space.slug,
        "description": space.description,
    }
    return JsonResponse(data)


# Views de autenticação 

@ensure_csrf_cookie
def csrf(request):
    # Gera e devolve o cookie de CSRF
    get_token(request)
    return JsonResponse({"detail": "CSRF cookie set"})


@require_http_methods(["POST"])
@csrf_protect
def login_view(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return JsonResponse(
            {"error": "Username and password are required"},
            status=400,
        )

    user = authenticate(request, username=username, password=password)
    if user is None:
        return JsonResponse({"error": "Invalid credentials"}, status=400)

    login(request, user)
    return JsonResponse({"id": user.id, "username": user.username})


@require_http_methods(["POST"])
def logout_view(request):
    logout(request)
    return JsonResponse({"detail": "Logged out"})


def me_view(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse(
            {"detail": "Authentication credentials were not provided."},
            status=401,
        )

    return JsonResponse({"id": user.id, "username": user.username})
