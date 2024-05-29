from django.db import models


class Weekday(models.Model):
    weekday = models.CharField(max_length=60)
    day_number = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.id} {self.weekday}"


class Schedule(models.Model):
    class Weekdays(models.IntegerChoices):
        monday = 1, "Lunes"
        tuesday = 2, "Martes"
        wednesday = 3, "Miercoles"
        thursday = 4, "Jueves"
        friday = 5, "Viernes"
        saturday = 6, "Sabado"
        sunday = 7, "Domingo"

    new_weekday = models.PositiveSmallIntegerField(choices=Weekdays.choices)

    start_time = models.TimeField("Hora Inicio")  # Time START
    end_time = models.TimeField("Hora Termina")  # Time END

    class Meta:
        ordering = ['weekday']


class Price(models.Model):
    new_price = models.CharField(max_length=280, default="$$$")
