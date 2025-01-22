from rest_framework import routers
from .views import SectorView

router = routers.DefaultRouter()
router.register(r'sectors', SectorView, 'sectors')

urlpatterns = router.urls