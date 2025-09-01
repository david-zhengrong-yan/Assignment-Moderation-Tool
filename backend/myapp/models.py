from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Administrator(AbstractUser):
    staffid = models.CharField(max_length=64)
    profile_picture = models.ImageField()

class Marker(AbstractUser):
    staffid = models.CharField(max_length=64)
    profile_picture = models.ImageField()

class Subject(models.Model):
    name = models.CharField(max_length=64)
    code = models.CharField(max_length=64)

class Assignment(models.Model):
    creation_date = models.DateTimeField()
    rubric = models.ImageField()
    number_of_questions = models.IntegerField()
    full_marks = models.JSONField()
    due_date = models.DateTimeField()
    administrator = models.ForeignKey(Administrator, on_delete=models.SET_NULL, null=True, blank=True)
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True)

class Submission(models.Model):
    name = models.CharField(max_length=64)
    comment = models.TextField()
    admin_percentages = models.JSONField()
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)

class Mark(models.Model):
    percentages = models.JSONField()
    is_finalized = models.BooleanField()
    marker = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE)



