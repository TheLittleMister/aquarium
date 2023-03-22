from courses.models import *
from django.db.models import F
from django.conf import settings

mysite = "http://127.0.0.1:8000" if settings.DEBUG else "https://aquariumschool.co"


def getFormErrors(form):

    messages = set()

    for field in form:
        for error in field.errors:
            myError = str(error).replace("Account", "cuenta")
            messages.add(f"{field.label}: {myError}")

    if list(form.errors.as_data())[-1] == "__all__":
        messages.add(
            str(form.errors.as_data()["__all__"][0])[2:-2]
        )

    return list(messages)


def getUser(user):
    return {
        "id": user.id,
        "username": user.username if user.username else "",
        "image": mysite + user.image.url,
        "type": "Administrador" if user.is_admin else "Profesor" if user.is_teacher else "Estudiante",
        "firstName": user.first_name if user.first_name else "",
        "lastName": user.last_name if user.last_name else "",
        "idType": user.id_type.id_type if user.id_type else "",
        "idTypeID": user.id_type.id if user.id_type else "",
        "identityDocument": user.identity_document if user.identity_document else "",
        "sex": user.sex.sex_name if user.sex else "",
        "sexID": user.sex.id if user.sex else "",
        "dateBirth": user.date_birth,
        "age": round((datetime.date.today() - user.date_birth).days // 365.25) if user.date_birth else None,
        "teacher": user.teacher.first_name + " " + user.teacher.last_name if user.teacher else "",
        "teacherID": user.teacher.id if user.teacher else "",
        "parent": user.parent if user.parent else "",
        "email": user.email if user.email else "",
        "phone1": user.phone_1 if user.phone_1 else "",
        "phone2": user.phone_2 if user.phone_2 else "",
        "signature":  mysite + user.signature.url if user.signature else ""
    }


def getPlus(accounts):

    students = list()

    for student in accounts:
        courseDates = []

        courses = student.courses.filter(
            date__gte=datetime.datetime.now() - datetime.timedelta(30)
        ).order_by("date", "start_time")

        for course in courses:

            if len(courseDates) > 1:
                timeDelta = courseDates[1] - courseDates[0]
                if timeDelta.days < 7:
                    students.append({
                        "username": student.username,
                        "id": student.id,
                        "identity_document": student.identity_document,
                        "first_name": student.first_name,
                        "last_name": student.last_name,
                        "phone_1": student.phone_1,
                        "real_last_login": student.real_last_login
                    })

                break

            else:
                courseDates.append(course.date)

    return students


def getInconsistencies(accounts):
    students = list()

    for student in accounts:
        if (
            student.attendances.filter(
                quota="PAGO", recover=False, onlyday=False
            ).count()
            % 4
            != 0
        ):
            students.append({
                "username": student.username,
                "id": student.id,
                "identity_document": student.identity_document,
                "first_name": student.first_name,
                "last_name": student.last_name,
                "phone_1": student.phone_1,
                "real_last_login": student.real_last_login
            })

    return students


def getUsersWithoutLevel(accounts):
    students = list()

    for student in accounts:

        if not student.levels.filter().exists():
            students.append({
                "username": student.username,
                "id": student.id,
                "identity_document": student.identity_document,
                "first_name": student.first_name,
                "last_name": student.last_name,
                "phone_1": student.phone_1,
                "real_last_login": student.real_last_login
            })

        else:
            to_append = True
            for level in student.levels.all():
                percentage = round(
                    Attendance.objects.filter(
                        course__date__gte=level.date,
                        student=student,
                        attendance=True,
                    ).count()
                    * 100
                    / level.attendances,
                    1,
                )

                if percentage < 100:
                    to_append = False
                    break

            if to_append:
                students.append({
                    "username": student.username,
                    "id": student.id,
                    "identity_document": student.identity_document,
                    "first_name": student.first_name,
                    "last_name": student.last_name,
                    "phone_1": student.phone_1,
                    "real_last_login": student.real_last_login
                })

    return students


def getHundredWithoutCertificate(accounts):
    students = list()

    for student in accounts:
        for level in student.levels.filter(certificate_img=""):
            percentage = round(
                Attendance.objects.filter(
                    course__date__gte=level.date,
                    student=student,
                    attendance=True,
                ).count()
                * 100
                / level.attendances,
                1,
            )

            if percentage >= 100:
                students.append({
                    "username": student.username,
                    "id": student.id,
                    "identity_document": student.identity_document,
                    "first_name": student.first_name,
                    "last_name": student.last_name,
                    "phone_1": student.phone_1,
                    "real_last_login": student.real_last_login
                })
                break

    return students


def getNoHundredWithCertificate(accounts):
    students = list()

    for student in accounts:
        for level in student.levels.filter().exclude(certificate_img=""):
            percentage = round(
                Attendance.objects.filter(
                    course__date__gte=level.date,
                    student=student,
                    attendance=True,
                ).count()
                * 100
                / level.attendances,
                1,
            )

            if percentage < 100:
                students.append({
                    "username": student.username,
                    "id": student.id,
                    "identity_document": student.identity_document,
                    "first_name": student.first_name,
                    "last_name": student.last_name,
                    "phone_1": student.phone_1,
                    "real_last_login": student.real_last_login
                })
                break

    return students
