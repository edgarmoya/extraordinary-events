from rest_framework import routers
from .views import ClassificationView, ActiveClassificationView, InactiveClassificationView


router = routers.DefaultRouter()
router.register(r'classifications', ClassificationView, 'classifications')
router.register(r'active-classifications', ActiveClassificationView, basename='active-classifications')
router.register(r'inactive-classifications', InactiveClassificationView, basename='inactive-classifications')

urlpatterns = router.urls