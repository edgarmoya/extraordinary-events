from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .serializers import SectorSerializer
from rest_framework.pagination import PageNumberPagination
from .models import Sector


# Create your views here.
class SectorPagination(PageNumberPagination):
    page_size = 25


class SectorView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,]
    serializer_class = SectorSerializer
    pagination_class = PageNumberPagination
    page_size = 25

    def get_queryset(self):
        return Sector.objects.all().order_by("-id")


class ActiveSectorView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,]
    serializer_class = SectorSerializer
    pagination_class = PageNumberPagination
    page_size = 25

    def get_queryset(self):
        return Sector.objects.filter(is_active=True).order_by("-id")


class InactiveSectorView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,]
    serializer_class = SectorSerializer
    pagination_class = PageNumberPagination
    page_size = 25

    def get_queryset(self):
        return Sector.objects.filter(is_active=False).order_by("-id")

