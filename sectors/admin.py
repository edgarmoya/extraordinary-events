from django.contrib import admin
from .models import Sector

# Register your models here.
class SectorAdmin(admin.ModelAdmin):
    list_display = ('description', 'is_active')
    search_fields = ('description',)
    list_filter = ('is_active',)

admin.site.register(Sector, SectorAdmin)