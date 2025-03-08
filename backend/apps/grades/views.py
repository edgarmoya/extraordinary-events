from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS, BasePermission
from .serializers import GradeSerializer
from .models import Grade

# Create your views here.
class IsGetRequest(BasePermission):
    # Permiso personalizado para permitir solo peticiones GET
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS

class GradeView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsGetRequest]
    serializer_class = GradeSerializer

    def get_queryset(self):
        queryset = Grade.objects.filter(is_active='True')
        return queryset
