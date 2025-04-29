from rest_framework import routers
from .views import EventsCountViewSet, \
                    EventsCountByProvinceViewSet, \
                    PercentageOfEventsBySectorViewSet, \
                    EventsCountScopeViewSet, \
                    EventsCountByTypeViewSet, \
                    EventSummaryViewSet

router = routers.DefaultRouter()

router.register(r'event_summary', EventSummaryViewSet, basename='event_summary')
router.register(r'events_count', EventsCountViewSet, basename='events_count')
router.register(r'events_count_by_province', EventsCountByProvinceViewSet, basename='events_count_by_province')
router.register(r'percentage_of_events_by_sector', PercentageOfEventsBySectorViewSet, basename='percentage_of_events_by_sector')
router.register(r'events_count_scope', EventsCountScopeViewSet, basename='events_count_scope')
router.register(r'events_count_by_type', EventsCountByTypeViewSet, basename='events_count_by_type')

urlpatterns = router.urls