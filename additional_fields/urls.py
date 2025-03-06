from rest_framework import routers
from .views import AdditionalFieldView, EventFieldValueView

router = routers.DefaultRouter()
router.register(r'addfields', AdditionalFieldView, 'addfields')
router.register(r'fieldvalue', EventFieldValueView, 'fieldvalue')

urlpatterns = router.urls