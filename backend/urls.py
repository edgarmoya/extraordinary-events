from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .api import MyTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('locations.urls')),
    path('api/', include('grades.urls')),
    path('api/', include('sectors.urls')),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
