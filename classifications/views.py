from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .serializers import ClassificationSerializer
from rest_framework.pagination import PageNumberPagination
from .models import Classification

# Create your views here.
class ClassificationPagination(PageNumberPagination):
    page_size = 25


class ClassificationView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,]
    serializer_class = ClassificationSerializer
    pagination_class = ClassificationPagination

    def get_queryset(self):
        search_term = self.request.query_params.get('search', '')
        queryset = Classification.objects.all()
        if search_term:
            queryset = queryset.filter(
                description__icontains=search_term
            )
        return queryset.order_by('-id')


class ActiveClassificationView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,]
    serializer_class = ClassificationSerializer
    pagination_class = ClassificationPagination

    def get_queryset(self):
        search_term = self.request.query_params.get('search', '')
        queryset = Classification.objects.filter(is_active=True)
        if search_term:
            queryset = queryset.filter(
                description__icontains=search_term
            )
        return queryset.order_by('-id')


class InactiveClassificationView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,]
    serializer_class = ClassificationSerializer
    pagination_class = ClassificationPagination

    def get_queryset(self):
        search_term = self.request.query_params.get('search', '')
        queryset = Classification.objects.filter(is_active=False)
        if search_term:
            queryset = queryset.filter(
                description__icontains=search_term
            )
        return queryset.order_by('-id')

