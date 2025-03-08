from rest_framework import permissions

class HasPermissionForAction(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action == 'create':
            return request.user.has_perm('events.add_event')
        if view.action == 'list':
            return request.user.has_perm('events.view_event')
        if view.action == 'retrieve':
            return request.user.has_perm('events.view_event')
        if view.action == 'update':
            return request.user.has_perm('events.change_event')
        if view.action == 'partial_update':
            return request.user.has_perm('events.change_event')
        if view.action == 'destroy':
            return request.user.has_perm('events.delete_event')
        return False