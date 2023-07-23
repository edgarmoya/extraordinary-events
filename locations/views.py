from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS, BasePermission
from .serializers import ProvinceSerializer, MunicipalitySerializer
from .models import Province, Municipality

# Create your views here.
class IsGetRequest(BasePermission):
    # Permiso personalizado para permitir solo peticiones GET
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS

class ProvinceView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,IsGetRequest]
    serializer_class = ProvinceSerializer

    def get_queryset(self):
        queryset = Province.objects.filter(is_active='True')
        return queryset

class MunicipalityView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,IsGetRequest]
    serializer_class = MunicipalitySerializer

    def get_queryset(self):
        queryset = Municipality.objects.filter(is_active='True')
        return queryset
