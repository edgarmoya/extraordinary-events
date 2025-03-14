from django.contrib import admin
from django.contrib.auth.models import Group
from .models import CustomUser, Role, CustomUserGroup
from django.contrib.auth.admin import UserAdmin

class CustomUserGroupInline(admin.TabularInline):
    model = CustomUserGroup
    extra = 1  # Muestra filas vacías para agregar nuevos registros

class UserAdminConfig(UserAdmin):
    model = CustomUser
    search_fields = ('user_name',)
    list_filter = ('is_active', 'is_staff')
    filter_horizontal = ()
    ordering = ('-start_date',)
    list_display = ('user_name', 'first_name', 'last_name', 'is_active', 'is_staff')
    fieldsets = (
        ('Información Personal', {'fields': ('password', 'user_name', 'first_name', 'last_name')}),
        ('Permisos', {'fields': ('is_active', 'is_staff')}),
    )
    add_fieldsets = (
        ("Información Personal", {
            'classes': ('wide',),
            'fields': ('user_name', 'first_name', 'last_name', 'password1', 'password2')}
        ),
        ('Permisos', {'fields': ('is_active', 'is_staff')}),
    )
    inlines = [CustomUserGroupInline]  # Agrega la relación con entidades

class GroupAdminConfig(admin.ModelAdmin):
    model = Group
    search_fields = ('name',)
    list_display = ('name',)
    inlines = [CustomUserGroupInline]  # Agrega la relación con entidades


admin.site.unregister(Group)
admin.site.register(Role, GroupAdminConfig)

admin.site.register(CustomUser, UserAdminConfig)
