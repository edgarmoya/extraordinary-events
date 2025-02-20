from rest_framework import permissions

class HasPermissionForAction(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action == 'create':
            return request.user.has_perm('sectors.add_sector')
        if view.action == 'list':
            # print(request.user.get_group_permissions())
            return request.user.has_perm('sectors.view_sector')
        if view.action == 'retrieve':
            return request.user.has_perm('sectors.view_sector')
        if view.action == 'update':
            return request.user.has_perm('sectors.change_sector')
        if view.action == 'partial_update':
            return request.user.has_perm('sectors.change_sector')
        if view.action == 'destroy':
            return request.user.has_perm('sectors.delete_sector')
        return False