from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from .serializers import EventSerializer, MeasureSerializer, AttachmentSerializer
from rest_framework.pagination import PageNumberPagination
from .models import Event, Measure, Attachment
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
        return queryset.order_by('-occurrence_date', '-created_date')

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
        return queryset.order_by('-occurrence_date', '-created_date')

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
        return queryset.order_by('-occurrence_date', '-created_date')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def destroy(self, request, *args, **kwargs):
        event = self.get_object()
        if event.status == 'closed':
            return Response({'error': 'No se puede eliminar un hecho con estado "cerrado".'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeasureView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, ]
    serializer_class = MeasureSerializer

    def get_queryset(self):
        event_id = self.request.query_params.get('event_id', '')
        queryset = Measure.objects.filter(event=event_id)
        return queryset

    def get_object(self):
        # Use the 'id' field as the primary key for retrieval
        measure_id = self.kwargs.get('pk')
        return Measure.objects.get(id=measure_id)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Measure.DoesNotExist:
            return Response({'error': 'Measure not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AttachmentView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, ]
    serializer_class = AttachmentSerializer

    def get_queryset(self):
        event_id = self.request.query_params.get('event_id', '')
        queryset = Attachment.objects.filter(event=event_id)
        return queryset
    
    def get_object(self):
        # Use the 'id' field as the primary key for retrieval
        attach_id = self.kwargs.get('pk')
        return Attachment.objects.get(id=attach_id)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Attachment.DoesNotExist:
            return Response({'error': 'Attachment not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)