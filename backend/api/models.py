from django.db import models
from django.contrib.auth.models import AbstractUser

# ------------------------------
# Custom User Model
# ------------------------------
class User(AbstractUser):
    # username, email, password_hash
    # Remove default username, use email as login
    profile_picture = models.ImageField(default=None, null=True, blank=True)

    # Role field to distinguish admin and marker
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('marker', 'Marker')
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='marker')

    def __str__(self):
        return f"{self.email} ({self.role})"


# ------------------------------
# Assignment Model
# ------------------------------
class Assignment(models.Model):
    name = models.CharField(max_length=64)
    creation_date = models.DateTimeField()
    rubric = models.FileField()
    assignment_file = models.FileField()
    mark_criteria = models.JSONField()
    due_date = models.DateTimeField()

    # Only administrators can be assigned
    administrator = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role': 'admin'}
    )

    def __str__(self):
        return f"Assignment {self.name} by {self.administrator}"


# ------------------------------
# Submission Model
# ------------------------------
class Submission(models.Model):
    name = models.CharField(max_length=64)
    submission_file = models.FileField()
    comment = models.TextField()
    admin_marks = models.JSONField(null=True, blank=True)
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)

    def __str__(self):
        return f"Submission {self.name} for {self.assignment}"


# ------------------------------
# Mark Model
# ------------------------------
class Mark(models.Model):
    marks = models.JSONField()
    is_finalized = models.BooleanField(default=False)

    # Only markers can be assigned here
    marker = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'marker'}
    )
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE)

    def __str__(self):
        return f"Marks for {self.submission} by {self.marker}"
