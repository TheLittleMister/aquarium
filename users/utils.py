from courses.models import *
from django.db.models import F


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

# FILTERS


def filter_it(user, filter, level, start, end):

    if filter == 0:  # TODOS

        if user.is_admin:
            return list(
                level.levels.filter(
                    is_active=True,
                    student__courses__date__gte=datetime.datetime.now()
                    - datetime.timedelta(15),
                    student__attendances__quota="PAGO",
                )
                .values(
                    "student__teacher__color__hex_code",
                    "student__teacher__username",
                    "student__id",
                    "student__identity_document",
                    "student__first_name",
                    "student__last_name",
                    "certificate_img",
                    "certificate_pdf",
                    "delivered",
                )
                .distinct()
                .order_by(F("delivered").desc(nulls_last=True))[start:end]
            )

        else:
            return list(
                level.levels.filter(
                    is_active=True,
                    student__teacher=user,
                    student__courses__date__gte=datetime.datetime.now()
                    - datetime.timedelta(15),
                    student__attendances__quota="PAGO",
                )
                .values(
                    "student__teacher__color__hex_code",
                    "student__teacher__username",
                    "student__id",
                    "student__identity_document",
                    "student__first_name",
                    "student__last_name",
                    "certificate_img",
                    "certificate_pdf",
                    "delivered",
                )
                .distinct()
                .order_by(F("delivered").desc(nulls_last=True))[start:end]
            )

    elif filter == 1:  # CERTIFICADOS
        # MyQuery.query.add_ordering(F("delivered").desc(nulls_last=True))

        if user.is_admin:
            return list(
                level.levels.filter(
                    is_active=True,
                    student__courses__date__gte=datetime.datetime.now()
                    - datetime.timedelta(15),
                    student__attendances__quota="PAGO",
                )
                .exclude(certificate_img="")
                .exclude(certificate_img__isnull=True)
                .values(
                    "student__teacher__color__hex_code",
                    "student__teacher__username",
                    "student__id",
                    "student__identity_document",
                    "student__first_name",
                    "student__last_name",
                    "certificate_img",
                    "certificate_pdf",
                    "delivered",
                )
                .distinct()
                .order_by(F("delivered").desc(nulls_last=True))[start:end]
            )

        else:
            return list(
                level.levels.filter(
                    is_active=True,
                    student__teacher=user,
                    student__courses__date__gte=datetime.datetime.now()
                    - datetime.timedelta(15),
                    student__attendances__quota="PAGO",
                )
                .exclude(certificate_img="")
                .exclude(certificate_img__isnull=True)
                .values(
                    "student__teacher__color__hex_code",
                    "student__teacher__username",
                    "student__id",
                    "student__identity_document",
                    "student__first_name",
                    "student__last_name",
                    "certificate_img",
                    "certificate_pdf",
                    "delivered",
                )
                .distinct()
                .order_by(F("delivered").desc(nulls_last=True))[start:end]
            )

    elif filter == 2:  # NO CERTIFICADOS

        if user.is_admin:
            return list(
                level.levels.filter(
                    is_active=True,
                    certificate_img="",
                    student__courses__date__gte=datetime.datetime.now()
                    - datetime.timedelta(15),
                    student__attendances__quota="PAGO",
                )
                .values(
                    "student__teacher__color__hex_code",
                    "student__teacher__username",
                    "student__id",
                    "student__identity_document",
                    "student__first_name",
                    "student__last_name",
                    "certificate_img",
                    "certificate_pdf",
                    "delivered",
                )
                .distinct()
                .order_by(F("delivered").desc(nulls_last=True))[start:end]
            )

        else:

            return list(
                level.levels.filter(
                    is_active=True,
                    certificate_img="",
                    student__teacher=user,
                    student__courses__date__gte=datetime.datetime.now()
                    - datetime.timedelta(15),
                    student__attendances__quota="PAGO",
                )
                .values(
                    "student__teacher__color__hex_code",
                    "student__teacher__username",
                    "student__id",
                    "student__identity_document",
                    "student__first_name",
                    "student__last_name",
                    "certificate_img",
                    "certificate_pdf",
                    "delivered",
                )
                .distinct()
                .order_by(F("delivered").desc(nulls_last=True))[start:end]
            )

    else:

        deliver = None  # Pendiente

        if filter == 3:  # Entregado
            deliver = False

        elif filter == 4:  # No Entregago
            deliver = True

        if user.is_admin:
            return list(
                level.levels.filter(
                    is_active=True,
                    delivered=deliver,
                    student__courses__date__gte=datetime.datetime.now()
                    - datetime.timedelta(15),
                    student__attendances__quota="PAGO",
                )
                .values(
                    "student__teacher__color__hex_code",
                    "student__teacher__username",
                    "student__id",
                    "student__identity_document",
                    "student__first_name",
                    "student__last_name",
                    "certificate_img",
                    "certificate_pdf",
                    "delivered",
                )
                .distinct()
                .order_by(F("delivered").desc(nulls_last=True))[start:end]
            )

        else:
            return list(
                level.levels.filter(
                    is_active=True,
                    delivered=deliver,
                    student__teacher=user,
                    student__courses__date__gte=datetime.datetime.now()
                    - datetime.timedelta(15),
                    student__attendances__quota="PAGO",
                )
                .values(
                    "student__teacher__color__hex_code",
                    "student__teacher__username",
                    "student__id",
                    "student__identity_document",
                    "student__first_name",
                    "student__last_name",
                    "certificate_img",
                    "certificate_pdf",
                    "delivered",
                )
                .distinct()
                .order_by(F("delivered").desc(nulls_last=True))[start:end]
            )
