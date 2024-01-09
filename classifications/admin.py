from django.contrib import admin
from .models import Classification

# Register your models here.
class ClassificationAdmin(admin.ModelAdmin):
    list_display = ('description', 'grade', 'is_active')
    search_fields = ('description',)
    list_filter = ('is_active', 'grade')

admin.site.register(Classification, ClassificationAdmin)