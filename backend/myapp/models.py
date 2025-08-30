from django.db import models


class Administrator():
    pass

class Marker():
    pass


class Assignment(models.Model):
    pass

class Submission():
    pass

# Create your models here.
class Subject(models.Model):
    name = models.CharField()
    code = models.CharField()