from django.contrib import admin
from .models import AdditionalField, EventFieldValue

class AdditionalFieldAdmin(admin.ModelAdmin):
    list_display = ('description', 'field_type', 'is_active')
    search_fields = ('description',)
    list_filter = ('is_active',)

class EventFieldValueAdmin(admin.ModelAdmin):
    list_display = ('event', 'add_field', 'value')
    list_filter = ('event',)

admin.site.register(AdditionalField, AdditionalFieldAdmin)
admin.site.register(EventFieldValue, EventFieldValueAdmin)
