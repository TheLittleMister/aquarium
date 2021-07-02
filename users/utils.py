from courses.models import *


# This function allows teacher schedule creation on profile (Can be better?)


def get_schedule(courses):

    schedule = []
    for course in courses:

        weekday = course.date.weekday()
        check = False

        for row_course in schedule:
            if row_course[0] == course.start_time and row_course[1] == course.end_time:

                row_course[2 + weekday] += list(
                    course.students.all().values(
                        "id",
                        "identity_document",
                        "first_name",
                        "last_name",
                        "phone_1",
                        "phone_2",
                        "teacher__username",
                        "teacher__color__hex_code",
                    )
                )

                row_course[2 + weekday] = [
                    i for i in row_course[2 + weekday] if i != "-"
                ]

                row_course[2 + weekday] = [
                    dict(s)
                    for s in set(frozenset(d.items()) for d in row_course[2 + weekday])
                ]

                row_course[2 + weekday] = sorted(
                    row_course[2 + weekday],
                    key=lambda k: k["teacher__username"]
                    if k["teacher__username"]
                    else "z",
                )

                check = True

        if check == False:

            week = {
                0: list(["-"]),
                1: list(["-"]),
                2: list(["-"]),
                3: list(["-"]),
                4: list(["-"]),
                5: list(["-"]),
                6: list(["-"]),
            }

            the_course = []

            the_course.append(course.start_time)
            the_course.append(course.end_time)
            week[weekday] = list(
                course.students.all().values(
                    "id",
                    "identity_document",
                    "first_name",
                    "last_name",
                    "phone_1",
                    "phone_2",
                    "teacher__username",
                    "teacher__color__hex_code",
                )
            )

            week[weekday] = sorted(
                week[weekday],
                key=lambda k: k["teacher__username"] if k["teacher__username"] else "z",
            )

            for i in range(7):  # 7 - Sunday
                the_course.append(week[i])  # Week days

            if the_course not in schedule:
                schedule.append(the_course)

    schedule.sort(key=lambda course: course[0])

    return schedule
