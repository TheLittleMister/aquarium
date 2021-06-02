from django.contrib import admin
from .models import Course, Attendance, Level, Student_Level


class courses(admin.ModelAdmin):
    filter_horizontal = ("students",)
    list_display = ("date", "start_time", "end_time",)


# Register your models here.
admin.site.register(Course, courses)
admin.site.register(Attendance)
admin.site.register(Level)
admin.site.register(Student_Level)
