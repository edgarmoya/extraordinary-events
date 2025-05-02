from django.urls import path, include
from .views import AskDeepSeekView

urlpatterns = [
    path('ask/', AskDeepSeekView.as_view(), name='ask-deepseek'),
]