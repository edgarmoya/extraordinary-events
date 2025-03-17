from rest_framework import viewsets, status, exceptions, views
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import CustomUserSerializer, ChangePasswordSerializer
from .models import CustomUser, CustomUserGroup
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from apps.events.models import Event
from django.db.models import Q
from django.shortcuts import get_object_or_404

class UserPagination(PageNumberPagination):
    page_size = 25

class UserView(viewsets.ModelViewSet):
    # Verifica que el usuario esté autenticado y tenga los permisos necesarios
    authentication_classes = [JWTAuthentication]  # Requiere autenticación basada en JWT
    permission_classes = [IsAuthenticated, ]

    # Define el serializador para procesar los datos de entrada y salida
    serializer_class = CustomUserSerializer

    # Establece la clase de paginación personalizada
    pagination_class = UserPagination

    def get_queryset(self):
        """
        Devuelve el conjunto de datos que será procesado por las operaciones de la vista.
        Aplica filtros opcionales según los parámetros 'search' y 'is_active' proporcionados en la solicitud.
        """
        # Obtiene los parámetros de búsqueda y estado de la solicitud
        search_term = self.request.query_params.get('search', '')
        is_active = self.request.query_params.get('is_active', '')

        user = self.request.user # Usuario autenticado

        # Si el usuario es superusuario, devuelve todos los usuarios
        if user.is_superuser:
            queryset = CustomUser.objects.all()
        else:
            # Obtiene las entidades donde el usuario autenticado es administrador
            admin_entities = CustomUserGroup.objects.filter(
                user=user, group__name='administrador'
            ).values_list('entity', flat=True)

            # Si el usuario no es administrador en ninguna entidad, devuelve un queryset vacío
            if not admin_entities:
                return CustomUser.objects.none()

            # Filtra los usuarios que pertenecen a esas entidades o que no tienen grupo asignado
            queryset = CustomUser.objects.filter(
                Q(customusergroup__entity__in=admin_entities) | Q(customusergroup__isnull=True)
            ).exclude(is_superuser=True)

        # Aplica el filtro por término de búsqueda si está presente
        if search_term:
            queryset = queryset.filter(user_name__icontains=search_term)

        # Aplica el filtro por estado si está presente
        if is_active:
            if is_active.lower() == 'true':
                queryset = queryset.filter(is_active=True)
            elif is_active.lower() == 'false':
                queryset = queryset.filter(is_active=False)
            else:
                queryset = queryset.none()  # Maneja el caso donde el valor no es válido

        # Ordena los resultados por orden alfabético de la descripción
        return queryset.order_by('user_name')

    def list(self, request, *args, **kwargs):
        """
        Devuelve los usuarios, con o sin paginación, dependiendo del parámetro 'page'
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
        Sobrescribe el método de eliminación para evitar borrar usuarios en uso
        """
        # Obtiene el usuario que se desea eliminar
        instance = self.get_object()

        # Verifica si el usuario está siendo utilizado en otros registros
        if Event.objects.filter(Q(created_by=instance) | Q(closed_by=instance)).exists():
            return Response(
                {"detail": "No se puede eliminar este usuario porque ya ha realizado operaciones"},
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

class ChangePasswordView(views.APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request, user_id=None):
        """Cambia la contraseña del usuario autenticado o de otro usuario si es un administrador"""
        user = request.user
        if not user_id:
            return Response({"detail": "Se debe proporcionar un 'user_id'"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            target_user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({"detail": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        # Verificar si el usuario autenticado es administrador de la misma entidad que el usuario objetivo
        user_entity_roles = CustomUserGroup.objects.filter(user=user) # Usuario que consulta
        target_user_roles = CustomUserGroup.objects.filter(user=target_user) # Usuario que se le va a cambiar la contraseña
        is_admin = user_entity_roles.filter(entity__in=[user.entity for user in target_user_roles], group__name='administrador').exists()

        # Verificar que el usuario que hace la solicitud puede cambiar la contraseña
        if user != target_user and not user.is_staff:
            if not is_admin:
                return Response({"detail": "No tiene permisos para cambiar la contraseña de este usuario"}, status=status.HTTP_403_FORBIDDEN)

        serializer = ChangePasswordSerializer(data=request.data, context={'is_admin': user.is_staff or is_admin})
        if serializer.is_valid():
            new_password = serializer.validated_data['new_password']

            # Si no es administrador, comprobar la contraseña actual
            if not user.is_staff:
                old_password = serializer.validated_data.get('old_password')
                if not target_user.check_password(old_password):
                    return Response({"detail": "La contraseña actual del usuario es incorrecta"}, status=status.HTTP_400_BAD_REQUEST)

            # Cambiar la contraseña del usuario objetivo
            target_user.set_password(new_password)
            target_user.save()

            return Response({"detail": "Contraseña cambiada con éxito"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomUserGroupView(views.APIView):
    permission_classes = [IsAuthenticated, ]

    def put(self, request, user_id=None):
        user = get_object_or_404(CustomUser, id=user_id)
        roles = request.data.get('roles')  # Lista de roles y entidades

        if not user or not roles:
            return Response({"detail": "Es requerido el usuario y los roles"}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(roles, list):
            return Response({"detail": "Los roles deben ser una lista"}, status=status.HTTP_400_BAD_REQUEST)

        # Obtener las relaciones existentes del usuario
        existing_roles = CustomUserGroup.objects.filter(user_id=user_id)

        # Crear un conjunto de claves (grupo, entidad) para las relaciones existentes
        existing_roles_set = set((role.group.id, role.entity.id_entity) for role in existing_roles)

        # Crear un conjunto de claves (grupo, entidad) para las nuevas relaciones
        new_roles_set = set((role['group_id'], role['entity_id']) for role in roles)

        # Eliminar relaciones que no están en el nuevo conjunto
        roles_to_delete = existing_roles_set - new_roles_set
        if roles_to_delete:
            CustomUserGroup.objects.filter(
                user_id=user_id,
                group__in=[role[0] for role in roles_to_delete],
                entity__in=[role[1] for role in roles_to_delete]
            ).delete()

        # Crear o modificar relaciones según el nuevo arreglo
        roles_to_create = new_roles_set - existing_roles_set

        # Crear nuevas relaciones
        created_groups = []
        for role in roles_to_create:
            group_id, entity_id = role
            user_group_entity = CustomUserGroup.objects.create(user_id=user_id, group_id=group_id, entity_id=entity_id)
            created_groups.append(user_group_entity)

        return Response({"detail": "Roles actualizados con éxito",}, status=status.HTTP_200_OK)

class UserGroupsView(views.APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request, user_id=None):
        """Obtiene los roles a los que pertenece un usuario especificado por 'user_id'"""
        if not user_id:
            return Response({"detail": "Se debe proporcionar un 'user_id'"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(id=user_id)  # Obtener el usuario por el 'user_id'
        except CustomUser.DoesNotExist:
            return Response({"detail": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        # Obtener los roles del usuario
        groups = CustomUserGroup.objects.filter(user=user).select_related('entity')

        grouped_roles = {}
        for group in groups:
            role = group.group.name
            entity = group.entity

            if role not in grouped_roles:
                grouped_roles[role] = []

            grouped_roles[role].append({"id":entity.id_entity, "entity": entity.description})

        # Devolver la respuesta con los nombres de los grupos
        return Response(grouped_roles, status=status.HTTP_200_OK)