from django.db import models
from users.models import *
from .labels import *

# Create your models here.


class Student_Level(models.Model):

    student = models.ForeignKey(
        Student, on_delete=models.CASCADE, related_name="levels")

    level = models.ForeignKey(
        Level, on_delete=models.CASCADE, related_name="levels")

    date = models.DateField()
    attendances = models.IntegerField(default=0)

    certificate_img = models.ImageField(
        upload_to="certificates", null=True, blank=True)

    certificate_pdf = models.FileField(
        upload_to="certificates", null=True, blank=True)
