from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .api import MyTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.events.urls')),
    path('api/', include('apps.users.urls')),
    path('api/', include('apps.locations.urls')),
    path('api/', include('apps.grades.urls')),
    path('api/', include('apps.sectors.urls')),
    path('api/', include('apps.entities.urls')),
    path('api/', include('apps.classifications.urls')),
    path('api/', include('apps.type_events.urls')),
    path('api/', include('apps.dashboard.urls')),
    path('api/', include('apps.additional_fields.urls')),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
