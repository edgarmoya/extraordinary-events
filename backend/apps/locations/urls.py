from rest_framework import routers
from .views import ProvinceView, MunicipalityView

# API versioning
router = routers.DefaultRouter()
router.register('province', ProvinceView, 'province')
router.register('municipality', MunicipalityView, 'municipality')

urlpatterns = router.urls