from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from .serializers import EventSerializer
from rest_framework.pagination import PageNumberPagination
from .models import Event
from .permissions import HasPermissionForAction
from rest_framework.response import Response


class EventPagination(PageNumberPagination):
    page_size = 25


class EventView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, HasPermissionForAction]
    serializer_class = EventSerializer
    pagination_class = EventPagination

    def get_queryset(self):
        search_term = self.request.query_params.get('search', '')
        queryset = Event.objects.all()
        if search_term:
            queryset = queryset.filter(
                synthesis__icontains=search_term
            )
        return queryset.order_by('-occurrence_date')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        event = self.get_object()
        if event.status == 'closed':
            return Response({'error': 'No se puede eliminar un hecho con estado "cerrado".'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OpenEventView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, HasPermissionForAction]
    serializer_class = EventSerializer
    pagination_class = EventPagination

    def get_queryset(self):
        search_term = self.request.query_params.get('search', '')
        queryset = Event.objects.filter(status='open')
        if search_term:
            queryset = queryset.filter(
                synthesis__icontains=search_term
            )
        return queryset.order_by('-occurrence_date')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def destroy(self, request, *args, **kwargs):
        event = self.get_object()
        if event.status == 'closed':
            return Response({'error': 'No se puede eliminar un hecho con estado "cerrado".'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ClosedEventView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, HasPermissionForAction]
    serializer_class = EventSerializer
    pagination_class = EventPagination

    def get_queryset(self):
        search_term = self.request.query_params.get('search', '')
        queryset = Event.objects.filter(status='closed')
        if search_term:
            queryset = queryset.filter(
                synthesis__icontains=search_term
            )
        return queryset.order_by('-occurrence_date')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def destroy(self, request, *args, **kwargs):
        event = self.get_object()
        if event.status == 'closed':
            return Response({'error': 'No se puede eliminar un hecho con estado "cerrado".'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)