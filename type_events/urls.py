from rest_framework import routers
from .views import TypeView, ActiveTypeView, InactiveTypeView


router = routers.DefaultRouter()
router.register(r'types', TypeView, 'types')
router.register(r'active-types', ActiveTypeView, basename='active-types')
router.register(r'inactive-types', InactiveTypeView, basename='inactive-types')

urlpatterns = router.urls