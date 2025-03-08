from rest_framework import routers
from .views import UserView

# API versioning
router = routers.DefaultRouter()
router.register('users', UserView, 'users')

urlpatterns = router.urls