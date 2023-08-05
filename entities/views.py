from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .serializers import EntitySerializer
from rest_framework.pagination import PageNumberPagination
from .models import Entity

# Create your views here.
class EntityPagination(PageNumberPagination):
    page_size = 25


class EntityView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,]
    serializer_class = EntitySerializer
    pagination_class = EntityPagination

    def get_queryset(self):
        search_term = self.request.query_params.get('search', '')
        queryset = Entity.objects.all()
        if search_term:
            queryset = queryset.filter(
                description__icontains=search_term
            )
        return queryset.order_by('-id_entity')


class ActiveEntityView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,]
    serializer_class = EntitySerializer
    pagination_class = EntityPagination

    def get_queryset(self):
        search_term = self.request.query_params.get('search', '')
        queryset = Entity.objects.filter(is_active=True)
        if search_term:
            queryset = queryset.filter(
                description__icontains=search_term
            )
        return queryset.order_by('-id_entity')


class InactiveEntityView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,]
    serializer_class = EntitySerializer
    pagination_class = EntityPagination

    def get_queryset(self):
        search_term = self.request.query_params.get('search', '')
        queryset = Entity.objects.filter(is_active=False)
        if search_term:
            queryset = queryset.filter(
                description__icontains=search_term
            )
        return queryset.order_by('-id_entity')
