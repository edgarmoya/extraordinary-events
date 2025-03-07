from rest_framework import viewsets, status, exceptions
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import EventSerializer, MeasureSerializer, AttachmentSerializer
from rest_framework.pagination import PageNumberPagination
from .models import Event, Measure, Attachment
from .permissions import HasPermissionForAction
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, NotFound


class EventPagination(PageNumberPagination):
    page_size = 25

class EventView(viewsets.ModelViewSet):
    # Verifica que el usuario esté autenticado y tenga los permisos necesarios
    authentication_classes = [JWTAuthentication]  # Requiere autenticación basada en JWT
    permission_classes = [IsAuthenticated, HasPermissionForAction]

    # Define el serializador para procesar los datos de entrada y salida
    serializer_class = EventSerializer

    # Establece la clase de paginación personalizada
    pagination_class = EventPagination

    def get_queryset(self):
        """
        Devuelve el conjunto de datos que será procesado por las operaciones de la vista.
        Aplica filtros opcionales según los parámetros 'search' y 'status' proporcionados en la solicitud.
        """
        # Obtiene los parámetros de búsqueda y estado de la solicitud
        search_term = self.request.query_params.get('search', '')
        status = self.request.query_params.get('status', '')

        # Obtiene todos los eventos disponibles inicialmente
        queryset = Event.objects.all()

        # Aplica el filtro por término de búsqueda si está presente
        if search_term:
            queryset = queryset.filter(synthesis__icontains=search_term)

        # Aplica el filtro por estado si está presente
        if status:
            queryset = queryset.filter(status=status)

        # Ordena los resultados por fecha de ocurrencia y creación de forma descendente
        return queryset.order_by('-occurrence_date', '-created_date')

    def perform_create(self, serializer):
        """
        Sobrescribe el método para asignar automáticamente el usuario autenticado 
        como creador del evento al guardar un nuevo registro.
        """
        serializer.save(created_by=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        """
        Sobrescribe el método de eliminación para evitar borrar eventos que estén 
        en estado 'closed'. Si el evento está cerrado, devuelve un error adecuado.
        """
        # Obtiene el evento que se desea eliminar
        event = self.get_object()

        # Comprueba si el evento está cerrado
        if event.status == 'closed':
            return Response({'detail': 'No se puede eliminar un hecho cerrado anteriormente'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Elimina el evento si no está cerrado
        event.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def handle_exception(self, exc):
        """
        Maneja excepciones específicas para proporcionar mensajes personalizados
        """
        if isinstance(exc, exceptions.PermissionDenied):
            return Response(
                {'detail': 'No tiene permiso para realizar esta acción'},
                status=status.HTTP_403_FORBIDDEN
            )
        if isinstance(exc, exceptions.AuthenticationFailed):
            return Response(
                {'detail': 'Autenticación fallida. Por favor, inicie sesión nuevamente'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        if isinstance(exc, exceptions.NotAuthenticated):
            return Response(
                {'detail': 'No autenticado. Se requiere autenticación para acceder a este recurso'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        return super().handle_exception(exc)


class MeasureView(viewsets.ModelViewSet):
    # Define las clases de permisos requeridas
    permission_classes = [IsAuthenticated, ]
    serializer_class = MeasureSerializer

    # Deshabilitar paginación en esta vista
    pagination_class = None

    def get_queryset(self):
        """
        Retorna el conjunto de medidas filtrado por el 'event_id' proporcionado 
        en los parámetros de la solicitud
        """
        # Obtiene el parámetro 'event_id' de la consulta
        event_id = self.request.query_params.get('event_id', '')

        # Valida que el 'event_id' sea proporcionado
        if not event_id:
            raise ValidationError({'detail': 'El parámetro event_id es obligatorio'})

        # Filtra las medidas relacionadas con el hecho especificado
        return Measure.objects.filter(event=event_id)

    def get_object(self):
        """
        Obtiene una medida específica utilizando su ID como clave primaria
        """
        measure_id = self.kwargs.get('pk')  # Obtiene el parámetro 'pk' de la URL
        try:
            return Measure.objects.get(id=measure_id)
        except Measure.DoesNotExist:
            raise NotFound(f'No se encontró la medida con el identificador {measure_id}')

    def destroy(self, request, *args, **kwargs):
        """
        Elimina una medida específica
        """
        try:
            instance = self.get_object()
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Measure.DoesNotExist:
            return NotFound(f'Medida no encontrada')
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AttachmentView(viewsets.ModelViewSet):
    # Define las clases de permisos requeridas
    permission_classes = [IsAuthenticated, ]
    serializer_class = AttachmentSerializer

    # Deshabilitar paginación en esta vista
    pagination_class = None

    def get_queryset(self):
        """
        Retorna el conjunto de anexos filtrado por el 'event_id' proporcionado 
        en los parámetros de la solicitud
        """
        # Obtiene el parámetro 'event_id' de la consulta
        event_id = self.request.query_params.get('event_id', '')

        # Valida que el 'event_id' sea proporcionado
        if not event_id:
            raise ValidationError({'detail': 'El parámetro event_id es obligatorio'})

        # Filtra los anexos relacionadas con el hecho especificado
        return Attachment.objects.filter(event=event_id)

    def get_object(self):
        """
        Obtiene un anexo específico utilizando su ID como clave primaria
        """
        attach_id = self.kwargs.get('pk')  # Obtiene el parámetro 'pk' de la URL
        try:
            return Attachment.objects.get(id=attach_id)
        except Attachment.DoesNotExist:
            raise NotFound(f'No se encontró el anexo con el identificador {attach_id}')

    def destroy(self, request, *args, **kwargs):
        """
        Elimina un anexo específico
        """
        try:
            instance = self.get_object()
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Attachment.DoesNotExist:
            return NotFound(f'Anexo no encontrado')
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)