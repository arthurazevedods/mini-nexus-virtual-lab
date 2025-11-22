from django.http import JsonResponse


def ping(request):
    return JsonResponse({"message": "Nexus Virtual Lab Django server is running 🚀"})
