from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .serializers import SectorSerializer
from rest_framework.pagination import PageNumberPagination
from .models import Sector
from .permissions import HasPermissionForAction


# Create your views here.
class SectorPagination(PageNumberPagination):
    page_size = 25


class SectorView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, HasPermissionForAction]
    serializer_class = SectorSerializer
    pagination_class = SectorPagination

    def get_queryset(self):
        search_term = self.request.query_params.get('search', '')
        queryset = Sector.objects.all()
        if search_term:
            queryset = queryset.filter(
                description__icontains=search_term
            )
        return queryset.order_by('-id')


class ActiveSectorView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, HasPermissionForAction]
    serializer_class = SectorSerializer
    pagination_class = SectorPagination

    def get_queryset(self):
        search_term = self.request.query_params.get('search', '')
        queryset = Sector.objects.filter(is_active=True)
        if search_term:
            queryset = queryset.filter(
                description__icontains=search_term
            )
        return queryset.order_by('-id')


class InactiveSectorView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, HasPermissionForAction]
    serializer_class = SectorSerializer
    pagination_class = SectorPagination

    def get_queryset(self):
        search_term = self.request.query_params.get('search', '')
        queryset = Sector.objects.filter(is_active=False)
        if search_term:
            queryset = queryset.filter(
                description__icontains=search_term
            )
        return queryset.order_by('-id')
