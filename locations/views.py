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
    permission_classes = [IsAuthenticated, IsGetRequest]
    serializer_class = ProvinceSerializer

    def get_queryset(self):
        queryset = Province.objects.filter(is_active='True').order_by('description')
        return queryset

class MunicipalityView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsGetRequest]
    serializer_class = MunicipalitySerializer

    def get_queryset(self):
        id_province = self.request.query_params.get('id_province', '')
        queryset = Municipality.objects.filter(is_active='True')
        if id_province:
            queryset = queryset.filter(province=id_province)
        return queryset.order_by('description')
