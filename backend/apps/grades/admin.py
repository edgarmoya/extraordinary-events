from django.contrib import admin
from .models import Grade

# Register your models here.
class GradeAdmin(admin.ModelAdmin):
    list_display = ('description', 'is_active')
    search_fields = ('description',)
    list_filter = ('is_active',)

admin.site.register(Grade, GradeAdmin)