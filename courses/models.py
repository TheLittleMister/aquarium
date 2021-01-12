from django.db import models
from users.models import Account
import datetime

# Create your models here.
class Course(models.Model):
    start_time = models.TimeField() # Time START 
    end_time = models.TimeField() # Time END
    date = models.DateField(null=True)
    students = models.ManyToManyField(Account, blank=True, related_name="courses") # Students(Account.student) M2M

    
    def __str__(self):
        start_time = datetime.datetime.strptime(f'{str(self.start_time)[:-3]}','%H:%M').strftime('%I:%M %p')
        end_time = datetime.datetime.strptime(f'{str(self.end_time)[:-3]}','%H:%M').strftime('%I:%M %p')
        month = self.date.strftime('%m')
        day = self.date.strftime('%d')
        year = self.date.strftime('%y')

        months = {"01": "Ene", "02": "Feb", "03": "Mar", "04": "Abr", "05": "May", "06": "Jun", "07": "Jul", "08": "Ago", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dic",}
        weekdays = {0: "Lunes", 1: "Martes", 2: "Miercoles", 3: "Jueves", 4: "Viernes", 5: "Sabado", 6: "Domingo",}
        
        return f"{weekdays[self.date.weekday()]} {day} {months[month]} {year} de {start_time} a {end_time}"

class Attendance(models.Model):
    student = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="attendance")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="attendance")
    attendance = models.BooleanField(default=False)
    cycle = models.BooleanField(default=False)

    PAID = "PAGO"
    N_PAID = "NO PAGO"
    DEF = "SEPARADO"
    
    quota_choices = (
        (PAID, "PAGO"),
        (N_PAID, "NO PAGO"),
        (DEF, "SEPARADO"),
    )

    quota = models.CharField(
        max_length=10,
        choices=quota_choices,
        default=DEF,
    ) # SEPARADO / PAGO / NO PAGO

    amount = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.student}"