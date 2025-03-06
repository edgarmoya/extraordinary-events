from rest_framework import permissions

class HasPermissionForAction(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == 'create':
            return request.user.has_perm('additional_fields.add_additionalfield')
        if view.action == 'list':
            return request.user.has_perm('additional_fields.view_additionalfield')
        if view.action == 'retrieve':
            return request.user.has_perm('additional_fields.view_additionalfield')
        if view.action == 'update':
            return request.user.has_perm('additional_fields.change_additionalfield')
        if view.action == 'partial_update':
            return request.user.has_perm('additional_fields.change_additionalfield')
        if view.action == 'destroy':
            return request.user.has_perm('additional_fields.delete_additionalfield')
        return False