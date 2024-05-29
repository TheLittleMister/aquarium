# getAttendances to PRINT
def getAttendances(course):

    attendances = list()

    for attendance in course.attendances.all():

        attendances.append({
            "cycle": None,
            "name": attendance.student.user.last_name + " " + attendance.student.user.first_name,
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
