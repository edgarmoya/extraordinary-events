from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .serializers import TypeSerializer
from rest_framework.pagination import PageNumberPagination
from .models import Type


# Create your views here.
class TypePagination(PageNumberPagination):
    page_size = 25


class TypeView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,]
    serializer_class = TypeSerializer
    pagination_class = TypePagination

    def get_queryset(self):
        search_term = self.request.query_params.get('search', '')
        queryset = Type.objects.all()
        if search_term:
            queryset = queryset.filter(
                description__icontains=search_term
            )
        return queryset.order_by('-id')


class ActiveTypeView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,]
    serializer_class = TypeSerializer
    pagination_class = TypePagination

    def get_queryset(self):
        search_term = self.request.query_params.get('search', '')
        queryset = Type.objects.filter(is_active=True)
        if search_term:
            queryset = queryset.filter(
                description__icontains=search_term
            )
        return queryset.order_by('-id')


class InactiveTypeView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,]
    serializer_class = TypeSerializer
    pagination_class = TypePagination

    def get_queryset(self):
        search_term = self.request.query_params.get('search', '')
        queryset = Type.objects.filter(is_active=False)
        if search_term:
            queryset = queryset.filter(
                description__icontains=search_term
            )
        return queryset.order_by('-id')
