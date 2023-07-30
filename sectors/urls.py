from rest_framework import routers
from .views import SectorView, ActiveSectorView, InactiveSectorView


router = routers.DefaultRouter()
router.register(r'sectors', SectorView, 'sectors')
router.register(r'active-sectors', ActiveSectorView, basename='active-sectors')
router.register(r'inactive-sectors', InactiveSectorView, basename='inactive-sectors')

urlpatterns = router.urls