from courses.models import *


# This function allows teacher schedule creation on profile (Can be better?)


def get_schedule(courses):

    schedule = []
    for course in courses:

        weekday = course.date.weekday()
        check = False

        for row_course in schedule:
            if row_course[0] == course.start_time and row_course[1] == course.end_time:

                # if row_course[2 + weekday] != "-":

                #     row_course[2 + weekday] = [row_course[2 + weekday]]

                #     row_course[2 + weekday] += list(course.students.all().values(
                #         'id', 'identity_document', 'first_name', 'last_name', 'phone_1', 'phone_2'))

                #     row_course[2 + weekday] = [dict(s) for s in set(frozenset(d.items())
                #                                                     for d in row_course[2 + weekday])]

                # else:
                row_course[2 + weekday] = list(course.students.all().values(
                    'id', 'identity_document', 'first_name', 'last_name', 'phone_1', 'phone_2'))

                # What if row_course[2 + weekday] already had a list? then += list() and then SET!
                check = True

        if check == False:

            week = {0: list(["-"]), 1: list(["-"]), 2: list(["-"]),
                    3: list(["-"]), 4: list(["-"]), 5: list(["-"]), 6: list(["-"])}

            the_course = []

            the_course.append(course.start_time)
            the_course.append(course.end_time)
            week[weekday] = list(course.students.all().values(
                'id', 'identity_document', 'first_name', 'last_name', 'phone_1', 'phone_2'))

            for i in range(7):  # 7 - Sunday
                the_course.append(week[i][0])  # Week days

            if the_course not in schedule:
                schedule.append(the_course)

    schedule.sort(key=lambda course: course[0])

    return schedule
