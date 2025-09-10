from django.contrib import admin
from .models import Assignment, Administrator, Mark, Submission, Marker

# Register your models here.

@admin.register(Administrator)
class AdministratorAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "email", "staffid", "profile_picture")
    search_fields = ("name", "email", "staffid")


@admin.register(Marker)
class MarkerAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "email", "staffid", "profile_picture")
    search_fields = ("name", "email", "staffid")


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ("id", "creation_date", "due_date", "administrator")
    list_filter = ("creation_date", "due_date")
    search_fields = ("administrator__name",)


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "assignment", "comment")
    search_fields = ("name", "assignment__id")


@admin.register(Mark)
class MarkAdmin(admin.ModelAdmin):
    list_display = ("id", "submission", "marker", "is_finalized")
    list_filter = ("is_finalized",)
    search_fields = ("submission__name", "marker__id")