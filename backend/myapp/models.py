from django.db import models
# Create your models here.

class Administrator(models.Model):
    name = models.CharField(max_length=64)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=64)
    staffid = models.CharField(max_length=64, unique=True)
    profile_picture = models.ImageField(default=None, null=True)

class Marker(models.Model):
    name = models.CharField(max_length=64)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=64)
    staffid = models.CharField(max_length=64, unique=True)
    profile_picture = models.ImageField(default=None, null=True)

class Assignment(models.Model):
    creation_date = models.DateTimeField()
    rubric = models.FileField()
    assignment_file = models.FileField()
    mark_criteria = models.JSONField()
    due_date = models.DateTimeField()
    administrator = models.ForeignKey(Administrator, on_delete=models.SET_NULL, null=True, blank=True)

class Submission(models.Model):
    name = models.CharField(max_length=64)
    submission_file = models.FileField()
    comment = models.TextField()
    admin_marks = models.JSONField()
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)

class Mark(models.Model):
    marks = models.JSONField()
    is_finalized = models.BooleanField()
    marker = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE)



