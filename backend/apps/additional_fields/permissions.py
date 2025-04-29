from rest_framework import permissions

class HasPermissionForAction(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False  # Bloquear si el usuario no está autenticado

        # Mapeo de acciones a permisos de Django
        action_permissions = {
            'create': 'additional_fields.add_additionalfield',
            'list': 'additional_fields.view_additionalfield',
            'retrieve': 'additional_fields.view_additionalfield',
            'update': 'additional_fields.change_additionalfield',
            'partial_update': 'additional_fields.change_additionalfield',
            'destroy': 'additional_fields.delete_additionalfield'
        }

        required_permission = action_permissions.get(view.action)
        if not required_permission:
            return False  # Acción no permitida si no está en el mapeo

        # Verificar si el usuario tiene el permiso en sus grupos
        return required_permission in request.user.get_group_permissions()
