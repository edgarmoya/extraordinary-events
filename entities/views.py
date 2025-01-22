from rest_framework import viewsets, status, exceptions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import EntitySerializer
from rest_framework.pagination import PageNumberPagination
from .models import Entity
from events.models import Event
from .permissions import HasPermissionForAction


class EntityPagination(PageNumberPagination):
    page_size = 25


class EntityView(viewsets.ModelViewSet):
    # Verifica que el usuario esté autenticado y tenga los permisos necesarios
    authentication_classes = [JWTAuthentication]  # Requiere autenticación basada en JWT
    permission_classes = [IsAuthenticated, HasPermissionForAction]

    # Define el serializador para procesar los datos de entrada y salida
    serializer_class = EntitySerializer

    # Establece la clase de paginación personalizada
    pagination_class = EntityPagination

    def get_queryset(self):
        """
        Devuelve el conjunto de datos que será procesado por las operaciones de la vista.
        Aplica filtros opcionales según los parámetros 'search' y 'is_active' proporcionados en la solicitud.
        """
        # Obtiene los parámetros de búsqueda y estado de la solicitud
        search_term = self.request.query_params.get('search', '')
        is_active = self.request.query_params.get('is_active', '')

        # Obtiene todas las entidades disponibles inicialmente
        queryset = Entity.objects.all()

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

        # Ordena los resultados por orden alfabético de la descripción
        return queryset.order_by('description')

    def list(self, request, *args, **kwargs):
        """
        Devuelve las entidades, con o sin paginación, dependiendo del parámetro 'page'
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

    def destroy(self, request, *args, **kwargs):
        """
        Sobrescribe el método de eliminación para evitar borrar entidades en uso
        """
        # Obtiene la entidad que se desea eliminar
        instance = self.get_object()

        # Verifica si la entidad está siendo utilizada en otros registros
        if Event.objects.filter(entity=instance).exists():
            return Response(
                {"detail": "No se puede eliminar esta entidad porque está siendo utilizada"},
                status=status.HTTP_400_BAD_REQUEST
        )

        # Si no está en uso, procede con la eliminación
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
