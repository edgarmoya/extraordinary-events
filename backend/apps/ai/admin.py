from django.contrib import admin
from .models import ModelKey

class ModelKeyAdmin(admin.ModelAdmin):
    list_display = ['api_key', 'model_name']
    search_fields = ('model_name',)

admin.site.register(ModelKey, ModelKeyAdmin)
