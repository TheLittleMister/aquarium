from django.db import models
from users.models import Account
import datetime

# Create your models here.
class Course(models.Model):
    start_time = models.TimeField() # Time START 
    end_time = models.TimeField() # Time END
    date = models.DateField(null=True)
    students = models.ManyToManyField(Account, blank=True, related_name="courses") # Students(Account.student) M2M

    class Meta:
        ordering = ['date']
    
    def __str__(self):
        start_time = datetime.datetime.strptime(f'{str(self.start_time)[:-3]}','%H:%M').strftime('%I:%M %p')
        end_time = datetime.datetime.strptime(f'{str(self.end_time)[:-3]}','%H:%M').strftime('%I:%M %p')
        month = self.date.strftime('%m')
        day = self.date.strftime('%d')
        year = self.date.strftime('%y')

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
        weekdays = {0: "Lunes", 1: "Martes", 2: "Miercoles", 3: "Jueves", 4: "Viernes", 5: "Sabado", 6: "Domingo",}
        
        return f"{weekdays[self.date.weekday()]} {day} {months[month]} {year} de {start_time} a {end_time}"

class Attendance(models.Model):
    student = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="attendance")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="attendance")
    attendance = models.BooleanField(default=False)
    cycle = models.BooleanField(default=False)
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
        default=PAID,
    ) # SEPARADO / PAGO / NO PAGO

    note = models.CharField(max_length=280)

    def __str__(self):
        return f"{self.student}"