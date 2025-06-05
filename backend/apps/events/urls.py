from rest_framework import routers
from django.urls import path
from .views import EventView, MeasureView, AttachmentView, ReportPDFView

router = routers.DefaultRouter()

router.register(r'events', EventView, 'events')
router.register(r'measures', MeasureView, basename='measures')
router.register(r'attachments', AttachmentView, 'attachments')

urlpatterns = [
    path('event/<int:event_id>/pdf/', ReportPDFView.as_view(), name='report-pdf'),
]

urlpatterns += router.urls