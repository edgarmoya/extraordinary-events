from django.urls import path
from .views import AskModelView

urlpatterns = [
    path('ask/', AskModelView.as_view(), name='ask-model'),
]