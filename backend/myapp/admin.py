from django.contrib import admin
from .models import Assignment, Administrator, Mark, Submission, Marker

# Register your models here.
admin.site.register(Assignment)
admin.site.register(Administrator)
admin.site.register(Mark)
admin.site.register(Submission)
admin.site.register(Marker)