from django.urls import path
from .views import event_counts, events_count_by_province, percentage_of_events_by_sector, events_count_scope, events_count_by_type

urlpatterns = [
    path('event_counts/', event_counts, name='event_counts'),
    path('events_count_by_province/<str:province_name>/', events_count_by_province, name='events_count_by_province'),
    path('percentage_of_events_by_sector/', percentage_of_events_by_sector, name='percentage_of_events_by_sector'),
    path('events_count_scope/', events_count_scope, name='events_count_scope'),
    path('events_count_by_type/', events_count_by_type, name='events_count_by_type'),
]