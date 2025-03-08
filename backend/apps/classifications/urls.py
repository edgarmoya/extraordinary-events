from rest_framework import routers
from .views import ClassificationView

router = routers.DefaultRouter()
router.register(r'classifications', ClassificationView, 'classifications')

urlpatterns = router.urls