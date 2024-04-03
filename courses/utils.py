from .models import *
from django.conf import settings

mysite = "http://127.0.0.1:8000/" if settings.DEBUG else "https://aquariumschool.co/"

# getAttendances to PRINT


def getAttendances(course):

    attendances = list()

    for attendance in course.attendances.all():

        attendances.append({
            "cycle": None,
            "name": attendance.student.last_name + " " + attendance.student.first_name,
            "recover": attendance.recover,
            "cycleStatus": attendance.cycle,
            "endCycleStatus": attendance.end_cycle,
            "onlyday": attendance.onlyday,
            "lastCourse": attendance.student.courses.last() == course,
            # "note": attendance.student.note
        })

        if attendance.student.attendances.filter(cycle=True, quota="PAGO").exists() and attendance.student.attendances.filter(end_cycle=True, quota="PAGO").exists():

            attendances[-1]['cycle'] = list(attendance.student.attendances.filter(
                course__date__gte=attendance.student.attendances.filter(
                    cycle=True, quota="PAGO").order_by('-course')[0].course.date,

                course__date__lte=attendance.student.attendances.filter(
                    end_cycle=True, quota="PAGO").order_by('-course')[0].course.date,

            ).values(
                "cycle",
                "end_cycle",
                "attendance",
                "course__date",
                "recover",
                "note"
            ).order_by('course'))

    return attendances


def get_weekdays():

    weekdays = {
        1: "Lunes",
        2: "Martes",
        3: "Miercoles",
        4: "Jueves",
        5: "Viernes",
        6: "Sabado",
        7: "Domingo",
    }

    return weekdays
