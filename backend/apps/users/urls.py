from rest_framework import routers
from django.urls import path
from .views import UserView, ChangePasswordView, UserGroupsView, CustomUserGroupView, LogoutView

router = routers.DefaultRouter()

router.register('users', UserView, 'users')

urlpatterns = [
    path('users/<int:user_id>/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('users/<int:user_id>/roles/', UserGroupsView.as_view(), name='roles'),
    path('users/<int:user_id>/update-roles/', CustomUserGroupView.as_view(), name='update_roles'),
    path("logout/", LogoutView.as_view(), name="logout")
]

urlpatterns += router.urls