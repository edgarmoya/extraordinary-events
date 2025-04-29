from rest_framework import permissions

class HasPermissionForAction(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False  # Bloquear si el usuario no está autenticado

        # Mapeo de acciones a permisos de Django
        action_permissions = {
            'create': 'sectors.add_sector',
            'list': 'sectors.view_sector',
            'retrieve': 'sectors.view_sector',
            'update': 'sectors.change_sector',
            'partial_update': 'sectors.change_sector',
            'destroy': 'sectors.delete_sector'
        }

        required_permission = action_permissions.get(view.action)
        if not required_permission:
            return False  # Acción no permitida si no está en el mapeo

        # Verificar si el usuario tiene el permiso en sus grupos
        return required_permission in request.user.get_group_permissions()
