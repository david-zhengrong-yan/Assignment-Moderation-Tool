from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, Assignment, Submission, Mark

# ------------------------------
# Custom User Admin
# ------------------------------
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Fields to display in the admin list view
    list_display = ('email', 'role', 'staffid', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active')

    # Fields to search
    search_fields = ('email', 'staffid')
    ordering = ('email',)

    # Fieldsets for viewing and editing users
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('staffid', 'profile_picture')}),
        (_('Permissions'), {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

    # Fields for creating a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'role', 'staffid', 'profile_picture', 'is_active', 'is_staff', 'is_superuser')}
        ),
    )


# ------------------------------
# Assignment Admin
# ------------------------------
@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'administrator', 'creation_date', 'due_date')
    list_filter = ('administrator', 'creation_date', 'due_date')
    search_fields = ('administrator__email',)
    ordering = ('-creation_date',)


# ------------------------------
# Submission Admin
# ------------------------------
@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'assignment')
    list_filter = ('assignment',)
    search_fields = ('name', 'assignment__id')
    ordering = ('-id',)


# ------------------------------
# Mark Admin
# ------------------------------
@admin.register(Mark)
class MarkAdmin(admin.ModelAdmin):
    list_display = ('id', 'submission', 'marker', 'is_finalized')
    list_filter = ('is_finalized', 'marker')
    search_fields = ('submission__name', 'marker__email')
    ordering = ('-id',)
