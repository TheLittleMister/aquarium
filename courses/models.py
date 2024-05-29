from django.db import models
from users.models import *

# Create your models here.


class Course(models.Model):
    start_time = models.TimeField()
    end_time = models.TimeField()
    date = models.DateField()

    students = models.ManyToManyField(
        Student, related_name="courses", blank=True)  # null has no effect on ManyToManyField

    class Meta:
        ordering = ['date', 'start_time']

    def __str__(self):
        return f"{self.date} from {self.start_time} to {self.end_time}"


class Attendance(models.Model):
    class Quotas(models.TextChoices):
        paid = "PAGO", "PAGO"
        unpaid = "SEPARADO", "SEPARADO"

    student = models.ForeignKey(
        Student, on_delete=models.CASCADE, related_name="attendances")
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="attendances")

    attendance = models.BooleanField(default=False)
    cycle = models.BooleanField(default=False)
    end_cycle = models.BooleanField(default=False)
    recover = models.BooleanField(default=False)
    onlyday = models.BooleanField(default=False)

    quota = models.CharField(
        max_length=8,
        choices=Quotas.choices,
        default=Quotas.unpaid,
    )

    note = models.CharField(max_length=280, null=True, blank=True)

    class Meta:
        ordering = ["-course__date", "-course__start_time"]

    def __str__(self):
        return f"{self.student}: {self.course}"
