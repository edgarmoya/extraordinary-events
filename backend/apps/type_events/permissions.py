from rest_framework import permissions

class HasPermissionForAction(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action == 'create':
            return request.user.has_perm('type_events.add_type')
        if view.action == 'list':
            return request.user.has_perm('type_events.view_type')
        if view.action == 'retrieve':
            return request.user.has_perm('type_events.view_type')
        if view.action == 'update':
            return request.user.has_perm('type_events.change_type')
        if view.action == 'partial_update':
            return request.user.has_perm('type_events.change_type')
        if view.action == 'destroy':
            return request.user.has_perm('type_events.delete_type')
        return False