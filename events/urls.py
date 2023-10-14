from rest_framework import routers
from .views import EventView, OpenEventView, ClosedEventView


router = routers.DefaultRouter()
router.register(r'events', EventView, 'events')
router.register(r'open-events', OpenEventView, basename='open-events')
router.register(r'closed-events', ClosedEventView, basename='closed-events')

urlpatterns = router.urls