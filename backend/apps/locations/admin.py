from django.contrib import admin
from .models import Province, Municipality

# Register your models here.
class ProvinceAdmin(admin.ModelAdmin):
    list_display = ('description', 'is_active')
    search_fields = ('description',)
    list_filter = ('is_active',)

class MunicipalityAdmin(admin.ModelAdmin):
    list_display = ('description', 'is_active', 'province')
    search_fields = ('description',)
    list_filter = ('is_active',)

admin.site.register(Province, ProvinceAdmin)
admin.site.register(Municipality, MunicipalityAdmin)
