from rest_framework import permissions

class HasPermissionForAction(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action == 'create':
            return request.user.has_perm('entities.add_entity')
        if view.action == 'list':
            return request.user.has_perm('entities.view_entity')
        if view.action == 'retrieve':
            return request.user.has_perm('entities.view_entity')
        if view.action == 'update':
            return request.user.has_perm('entities.change_entity')
        if view.action == 'partial_update':
            return request.user.has_perm('entities.change_entity')
        if view.action == 'destroy':
            return request.user.has_perm('entities.delete_entity')
        return False