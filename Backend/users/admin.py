# users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Profile, SellerProfile

class UserAdmin(BaseUserAdmin):
    ordering = ('email',)
    list_display = ('email','first_name','last_name','role','is_staff','is_active')
    search_fields = ('email',)
    fieldsets = (
        (None, {'fields': ('email','password')}),
        ('Personal', {'fields': ('first_name','last_name')}),
        ('Permissions', {'fields': ('is_active','is_staff','is_superuser','role')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email','password1','password2','role')
        }),
    )

admin.site.register(User, UserAdmin)
admin.site.register(Profile)
admin.site.register(SellerProfile)
