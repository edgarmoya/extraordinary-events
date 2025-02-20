from rest_framework import routers
from .views import TypeView

router = routers.DefaultRouter()
router.register(r'types', TypeView, 'types')

urlpatterns = router.urls