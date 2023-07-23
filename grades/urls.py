from rest_framework import routers
from .views import GradeView


router = routers.DefaultRouter()
router.register('grade', GradeView, 'grade')

urlpatterns = router.urls