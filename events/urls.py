from rest_framework import routers
from .views import EventView, OpenEventView, ClosedEventView, MeasureView, AttachmentView


router = routers.DefaultRouter()
router.register(r'events', EventView, 'events')
router.register(r'open-events', OpenEventView, basename='open-events')
router.register(r'closed-events', ClosedEventView, basename='closed-events')

router.register(r'measures', MeasureView, basename='measures')
router.register(r'attachments', AttachmentView, 'attachments')

urlpatterns = router.urls