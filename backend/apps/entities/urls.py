from rest_framework import routers
from .views import EntityView

router = routers.DefaultRouter()
router.register(r'entities', EntityView, 'entities')

urlpatterns = router.urls