from django.db import models
from users.models import Account
import datetime
from datetime import date
from .labels import *

# Create your models here.


class Course(models.Model):
    start_time = models.TimeField("Hora Inicio")  # Time START
    end_time = models.TimeField("Hora Termina")  # Time END
    date = models.DateField("Fecha", null=True)
    # Students(Account.student) M2M
    students = models.ManyToManyField(
        Account, blank=True, related_name="courses")
    teachers = models.ManyToManyField(
        Account, blank=True, related_name="teacher_courses")

    @property
    def is_past_due(self):
        return date.today() > self.date

    @property
    def is_today(self):
        return date.today() == self.date

    class Meta:
        ordering = ['date', 'start_time']

    def __str__(self):
        start_time = datetime.datetime.strptime(
            f'{str(self.start_time)[:-3]}', '%H:%M').strftime('%I:%M %p')
        end_time = datetime.datetime.strptime(
            f'{str(self.end_time)[:-3]}', '%H:%M').strftime('%I:%M %p')
        month = self.date.strftime('%m')
        day = self.date.strftime('%d')
        year = self.date.strftime('%Y')

        months = {
            "01": "Enero",
            "02": "Febrero",
            "03": "Marzo",
            "04": "Abril",
            "05": "Mayo",
            "06": "Junio",
            "07": "Julio",
            "08": "Agosto",
            "09": "Septiembre",
            "10": "Octubre",
            "11": "Noviembre",
            "12": "Diciembre",
        }
        weekdays = {0: "Lunes", 1: "Martes", 2: "Miercoles",
                    3: "Jueves", 4: "Viernes", 5: "Sabado", 6: "Domingo", }

        return f"{weekdays[self.date.weekday()]} {day} {months[month]} {year} de {start_time} a {end_time}"


class Attendance(models.Model):
    student = models.ForeignKey(
        Account, on_delete=models.CASCADE, related_name="attendances")
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="attendances")
    image = models.ImageField("Imagen", upload_to="receipts", blank=True)

    attendance = models.BooleanField(default=False)
    cycle = models.BooleanField(default=False)
    end_cycle = models.BooleanField(default=False)
    recover = models.BooleanField(default=False)
    onlyday = models.BooleanField(default=False)

    PAID = "PAGO"
    N_PAID = "NO PAGO"
    SEP = "SEPARADO"

    quota_choices = (
        (PAID, "PAGO"),
        (N_PAID, "NO PAGO"),
        (SEP, "SEPARADO"),
    )

    quota = models.CharField(
        max_length=10,
        choices=quota_choices,
        default=SEP,
    )  # SEPARADO / PAGO / NO PAGO

    note = models.CharField("Nota", max_length=280, null=True, blank=True)

    class Meta:
        ordering = ['student']

    def __str__(self):
        return f"{self.student}: {self.course}"


class Student_Level(models.Model):

    student = models.ForeignKey(
        Account, on_delete=models.CASCADE, related_name="levels")

    level = models.ForeignKey(
        Level, on_delete=models.CASCADE, related_name="levels")
    date = models.DateField("Desde", null=True)
    attendances = models.IntegerField("Asistencias Requeridas", default=0)

    certificate_img = models.ImageField(
        upload_to="certificates", null=True, blank=True)

    certificate_pdf = models.FileField(
        upload_to="certificates", null=True, blank=True)

    is_active = models.BooleanField(default=False)

    delivered = models.BooleanField(
        default=True, null=True, blank=True)  # Inverted bool


class Note(models.Model):

    student = models.ForeignKey(
        Account, on_delete=models.CASCADE, related_name="all_notes")

    teacher = models.ForeignKey(
        Account, on_delete=models.CASCADE, related_name="notes")

    note = models.CharField("Nota", max_length=600)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
