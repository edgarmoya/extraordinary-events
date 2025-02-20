from django.contrib import admin
from .models import Entity

# Register your models here.
class EntityAdmin(admin.ModelAdmin):
    list_display = ('description', 'municipality', 'sector', 'email', 'address', 'is_active')
    search_fields = ('description',)
    list_filter = ('is_active',)

admin.site.register(Entity, EntityAdmin)