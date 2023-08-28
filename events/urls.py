from rest_framework import routers
from .views import EventView


router = routers.DefaultRouter()
router.register(r'events', EventView, 'events')

urlpatterns = router.urls