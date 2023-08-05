from rest_framework import routers
from .views import EntityView, ActiveEntityView, InactiveEntityView


router = routers.DefaultRouter()
router.register(r'entities', EntityView, 'entities')
router.register(r'active-entities', ActiveEntityView, basename='active-entities')
router.register(r'inactive-entities', InactiveEntityView, basename='inactive-entities')

urlpatterns = router.urls