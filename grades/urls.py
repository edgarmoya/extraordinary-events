from rest_framework import routers
from .views import GradeView


router = routers.DefaultRouter()
router.register('grades', GradeView, 'grades')

urlpatterns = router.urls