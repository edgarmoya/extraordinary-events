from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .serializers import ProvinceSerializer, MunicipalitySerializer
from .models import Province, Municipality

# Create your views here.
class ProvinceView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,]
    serializer_class = ProvinceSerializer

    def get_queryset(self):
        queryset = Province.objects.filter(is_active='True')
        return queryset

class MunicipalityView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,]
    serializer_class = MunicipalitySerializer

    def get_queryset(self):
        queryset = Municipality.objects.filter(is_active='True')
        return queryset
