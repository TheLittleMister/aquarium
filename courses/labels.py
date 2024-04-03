from django.db import models


class Weekday(models.Model):
    weekday = models.CharField(max_length=60)
    day_number = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.id} {self.weekday}"


class Schedule(models.Model):
    weekday = models.ForeignKey(
        Weekday, on_delete=models.CASCADE, related_name="schedules")

    start_time = models.TimeField("Hora Inicio")  # Time START
    end_time = models.TimeField("Hora Termina")  # Time END

    class Meta:
        ordering = ['weekday']


class Price(models.Model):
    price = models.IntegerField(default=0)
