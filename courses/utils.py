from .models import *

# This Function allows to print a course


def get_schedules(courses):

    schedules = dict()

    for course in courses:

        schedules[course] = dict()

        for attendance in course.attendances.all():

            schedules[course][attendance] = {
                "cycle": None,
            }

            if attendance.student.attendances.filter(cycle=True, quota="PAGO").exists() and attendance.student.attendances.filter(end_cycle=True, quota="PAGO").exists():

                schedules[course][attendance]['cycle'] = attendance.student.attendances.filter(
                    course__date__gte=attendance.student.attendances.filter(
                        cycle=True, quota="PAGO").order_by('-course')[0].course.date,

                    course__date__lte=attendance.student.attendances.filter(
                        end_cycle=True, quota="PAGO").order_by('-course')[0].course.date,

                ).order_by('course')

    return schedules

# This function allows student schedule creation on profile (Can be better?)


def get_schedule(courses):

    schedule = []
    for course in courses:

        weekday = course['date'].weekday()
        check = False

        for row_course in schedule:
            if row_course[0] == course["start_time"] and row_course[1] == course["end_time"]:
                row_course[2 + weekday] = "✔"
                check = True

        if check == False:

            week = {0: ["-"], 1: ["-"], 2: ["-"],
                    3: ["-"], 4: ["-"], 5: ["-"], 6: ["-"]}

            the_course = []

            the_course.append(course["start_time"])
            the_course.append(course["end_time"])
            week[weekday] = "✔"

            for i in range(7):  # 7 - Sunday
                the_course.append(week[i][0])  # Week days

            if the_course not in schedule:
                schedule.append(the_course)

    schedule.sort(key=lambda course: course[0])

    return schedule

# This function gets the student statistics


def get_student_statistics(student):

    # Number of paid courses
    paid_courses = student.attendances.filter(
        quota="PAGO", recover=False, onlyday=False).count()

    # Number of attended courses
    attended = student.attendances.filter(
        course__date__lte=datetime.datetime.now(), attendance=True).count()

    # Number of failed courses
    failed = student.attendances.filter(course__date__lt=datetime.datetime.now(
    ), attendance=False, quota="PAGO", recover=False, onlyday=False).count()

    # Number of recovered courses
    recovered = student.attendances.filter(
        course__date__lt=datetime.datetime.now(), attendance=True, recover=True).count()

    # Get the Number of courses that can be recovered

    N = 4  # N represents the number of courses required to recover 1 course.

    # This equation gets the available courses to be recovered
    available = ((paid_courses // N) - recovered)
    # Get the number of courses that were failed and never recovered.
    rfailed = failed - recovered

    if rfailed < 0:
        rfailed = 0

    # If by any chance the available courses to be recovered are less or equal to 0 then 0 can be recovered.
    if available <= 0:
        can_recover = 0

    # If the available courses to be recovered are more or equal to the courses failed
    # then the number of courses failed can be recovered.
    elif available >= rfailed:
        can_recover = rfailed

    # If the available courses to be recovered are less than the failed
    # then the available courses to be recovered can be recovered.
    else:
        can_recover = available

    # ----------

    # Get number of quotas that were not paid:
    n_paid = student.attendances.filter(quota="NO PAGO").count()

    # Get number of reserved quotas:
    sep = student.attendances.filter(quota="SEPARADO").count()

    # Get only-day paid courses that were attended
    onlyday = student.attendances.filter(attendance=True, onlyday=True).count()

    # Get TOTAL number of student's courses
    total = paid_courses + n_paid + sep + onlyday

    return {
        "attended": attended,
        "failed": failed,
        "recovered": recovered,
        "can_recover": can_recover,
        "paid": paid_courses,
        "n_paid": n_paid,
        "sep": sep,
        "total": total,
        "onlyday": onlyday,
    }
