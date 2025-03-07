from rest_framework import permissions

class HasPermissionForAction(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action == 'create':
            return request.user.has_perm('classifications.add_classification')
        if view.action == 'list':
            return request.user.has_perm('classifications.view_classification')
        if view.action == 'retrieve':
            return request.user.has_perm('classifications.view_classification')
        if view.action == 'update':
            return request.user.has_perm('classifications.change_classification')
        if view.action == 'partial_update':
            return request.user.has_perm('classifications.change_classification')
        if view.action == 'destroy':
            return request.user.has_perm('classifications.delete_classification')
        return False