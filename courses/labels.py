from django.db import models


class Schedule(models.Model):
    class Weekdays(models.IntegerChoices):
        monday = 1, "Lunes"
        tuesday = 2, "Martes"
        wednesday = 3, "Miercoles"
        thursday = 4, "Jueves"
        friday = 5, "Viernes"
        saturday = 6, "Sabado"
        sunday = 7, "Domingo"

    weekday = models.PositiveSmallIntegerField(choices=Weekdays.choices)

    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        ordering = ['weekday', "start_time"]


class Price(models.Model):
    price = models.CharField(max_length=280, default="$$$")
