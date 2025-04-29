from django.contrib import admin
from .models import Event, Attachment, Measure
from .forms import EventAdminForm


class EventAdmin(admin.ModelAdmin):
    form = EventAdminForm

    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        obj.save()

    list_display = ('synthesis', 'entity', 'status', 'scope', 'created_by', 'created_date')
    search_fields = ('synthesis',)
    list_filter = ('status', 'scope', 'created_date')


class MeasureAdmin(admin.ModelAdmin):
    list_display = ('description', 'event')
    search_fields = ('description',)
    list_filter = ('event',)


class AttachmentAdmin(admin.ModelAdmin):
    list_display = ('image', 'event')
    search_fields = ('event',)
    list_filter = ('event',)


admin.site.register(Measure, MeasureAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(Attachment, AttachmentAdmin)
