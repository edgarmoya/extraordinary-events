from django.contrib import admin
from .models import Type

# Register your models here.
class TypeAdmin(admin.ModelAdmin):
    list_display = ('description', 'is_catastrophic', 'is_active')
    search_fields = ('description',)
    list_filter = ('is_active', 'is_catastrophic')

admin.site.register(Type, TypeAdmin)