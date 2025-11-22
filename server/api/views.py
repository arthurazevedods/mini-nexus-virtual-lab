from django.http import JsonResponse
from .models import Space

def ping(request):
    return JsonResponse({"message": "Nexus Virtual Lab Django server is running 🚀"})

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