from rest_framework import viewsets, status, exceptions
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import AdditionalFieldSerializer, EventFieldValueSerializer
from rest_framework.pagination import PageNumberPagination
from .models import AdditionalField, EventFieldValue
from .permissions import HasPermissionForAction
from rest_framework.response import Response
from additional_fields.models import EventFieldValue
from rest_framework.exceptions import ValidationError, NotFound

class AdditionalFieldPagination(PageNumberPagination):
    page_size = 25

class AdditionalFieldView(viewsets.ModelViewSet):
    # Verifica que el usuario esté autenticado y tenga los permisos necesarios
    authentication_classes = [JWTAuthentication]  # Requiere autenticación basada en JWT
    permission_classes = [IsAuthenticated, HasPermissionForAction]

    # Define el serializador para procesar los datos de entrada y salida
    serializer_class = AdditionalFieldSerializer

    # Establece la clase de paginación personalizada
    pagination_class = AdditionalFieldPagination

    def get_queryset(self):
        """
        Devuelve el conjunto de datos que será procesado por las operaciones de la vista.
        Aplica filtros opcionales según los parámetros 'search' y 'is_active' proporcionados en la solicitud.
        """
        # Obtiene los parámetros de búsqueda y estado de la solicitud
        search_term = self.request.query_params.get('search', '')
        is_active = self.request.query_params.get('is_active', '')

        # Obtiene todos los campos disponibles inicialmente
        queryset = AdditionalField.objects.all()

        # Aplica el filtro por término de búsqueda si está presente
        if search_term:
            queryset = queryset.filter(description__icontains=search_term)

        # Aplica el filtro por estado si está presente
        if is_active:
            if is_active.lower() == 'true':
                queryset = queryset.filter(is_active=True)
            elif is_active.lower() == 'false':
                queryset = queryset.filter(is_active=False)
            else:
                queryset = queryset.none()  # Maneja el caso donde el valor no es válido

        # Ordena los resultados por orden alfabético
        return queryset.order_by('description')

    def list(self, request, *args, **kwargs):
        """
        Devuelve los campos adicionales, con o sin paginación, dependiendo del parámetro 'page'
        """
        # Obtiene el queryset
        queryset = self.filter_queryset(self.get_queryset())

        # Verifica si el parámetro 'page' está presente
        page = self.request.query_params.get('page', None)
        if page is not None:
            # Si 'page' está presente, aplica la paginación
            paginated_queryset = self.paginate_queryset(queryset)
            if paginated_queryset is not None:
                serializer = self.get_serializer(paginated_queryset, many=True)
                return self.get_paginated_response(serializer.data)

        # Si 'page' no está presente, devuelve todos los datos sin paginación
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """
        Sobrescribe el método de actualización para evitar cambiar el campo 'field_type'
        si ya está en uso.
        """
        instance = self.get_object()  # Obtiene la instancia actual
        new_field_type = request.data.get('field_type')  # Obtiene el nuevo valor de 'field_type'

        # Verifica si 'field_type' está siendo usado y si se intenta cambiar
        if new_field_type != None and instance.field_type != new_field_type:
            # Comprueba si el campo está siendo utilizado en otros registros
            if EventFieldValue.objects.filter(add_field=instance).exists():
                return Response(
                    {"detail": "No se puede cambiar el tipo de un campo adicional que está siendo usado"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Si no está en uso o no se intenta cambiar, continúa con la actualización
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """
        Sobrescribe el método de eliminación para evitar borrar campos adicionales que estén 
        siendo usados
        """
        # Obtiene el campo que se desea eliminar
        instance = self.get_object()

        # Verifica si el campo está siendo utilizada en otros registros
        if EventFieldValue.objects.filter(add_field=instance).exists():
            return Response(
                {"detail": "No se puede eliminar este campo porque está siendo utilizado"},
                status=status.HTTP_400_BAD_REQUEST
        )

        # Elimina el campo si no está siendo usado
        instance.delete()
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

class EventFieldValueView(viewsets.ModelViewSet):
    # Define las clases de permisos requeridas
    permission_classes = [IsAuthenticated, ]
    serializer_class = EventFieldValueSerializer

    # Deshabilitar paginación en esta vista
    pagination_class = None

    def get_queryset(self):
        """
        Retorna el conjunto de campos filtrado por el 'event_id' proporcionado 
        en los parámetros de la solicitud
        """
        # Obtiene el parámetro 'event_id' de la consulta
        event_id = self.request.query_params.get('event_id', '')

        # Valida que el 'event_id' sea proporcionado
        if not event_id:
            raise ValidationError({'detail': 'El parámetro event_id es obligatorio'})

        # Filtra los campos relacionados con el hecho especificado
        return EventFieldValue.objects.filter(event=event_id)

    def get_object(self):
        """
        Obtiene un campo => valor específico utilizando su ID como clave primaria
        """
        field_id = self.kwargs.get('pk')  # Obtiene el parámetro 'pk' de la URL
        try:
            return EventFieldValue.objects.get(id=field_id)
        except EventFieldValue.DoesNotExist:
            raise NotFound(f'No se encontró el campo con el identificador {field_id}')

    def destroy(self, request, *args, **kwargs):
        """
        Elimina un campo=>vaalor específico
        """
        try:
            instance = self.get_object()
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except EventFieldValue.DoesNotExist:
            return NotFound(f'Campo no encontrado')
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
