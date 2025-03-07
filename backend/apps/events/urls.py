from rest_framework import routers
from .views import EventView, MeasureView, AttachmentView

router = routers.DefaultRouter()

router.register(r'events', EventView, 'events')
router.register(r'measures', MeasureView, basename='measures')
router.register(r'attachments', AttachmentView, 'attachments')

urlpatterns = router.urls