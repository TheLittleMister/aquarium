from courses.models import *
from django.conf import settings

import datetime


mysite = "http://127.0.0.1:8000" if settings.DEBUG else "https://aquariumschool.co"


def getFormErrors(form):

    messages = set()

    for field in form:
        for error in field.errors:
            # myError = str(error).replace("User", "cuenta")
            messages.add(f"{field.label}: {str(error)}")

    if list(form.errors.as_data()) and list(form.errors.as_data())[-1] == "__all__":
        messages.add(
            str(form.errors.as_data()["__all__"][0])[2:-2]
        )

    return list(messages)


def getUser(user):
    if user.type == "Administrador":
        return getBaseUser(user)

    elif user.type == "Profesor":
        return getTeacher(user)

    elif user.type == "Estudiante":
        return getStudent(user)


def getBaseUser(user):
    return {
        "type": user.type,
        "id": user.id,
        "email": user.email or "",
        "username": user.username,
        "idDocument": user.id_document or "",
        "profileImage": mysite + user.profile_image.url,
        "firstName": user.first_name or "",
        "lastName": user.last_name or "",
        "gender": user.gender or "",
        "birthDate": user.birth_date or "",
        "age": round((datetime.date.today() - user.birth_date).days // 365.25) if user.birth_date else "",
        "phoneNumber": user.phone_number or ""
    }


def getStudent(user):
    return {
        **getBaseUser(user),
        "studentID": user.student.id,
        "parentName": user.student.parent_name or "",
        "phoneNumber2": user.student.phone_number_2 or "",
        "teacherID": user.student.teacher.user.id if user.student.teacher else "",
        "teacherName": user.student.teacher.user.first_name + " " + user.student.teacher.user.last_name if user.student.teacher else "",
    }


def getTeacher(user):
    return {
        **getBaseUser(user),
        "teacherID": user.teacher.id,
        "eSignature": mysite + user.teacher.e_signature.url if user.teacher.e_signature else ""
    }


def getStudentInfo(student):
    return {
        "user__username": student.user.username,
        "user__id": student.user.id,
        "user__id_document": student.user.id_document,
        "user__first_name": student.user.first_name,
        "user__last_name": student.user.last_name,
        "user__phone_number": student.user.phone_number,
        "user__last_session": student.user.last_session
    }


def getPlus(students):

    studentsFiltered = list()

    for student in students:
        courseDates = []

        courses = student.courses.filter(
            date__gte=datetime.datetime.now() - datetime.timedelta(30)
        ).order_by("date", "start_time")

        for course in courses:

            if len(courseDates) > 1:
                timeDelta = courseDates[1] - courseDates[0]
                if timeDelta.days < 7:
                    studentsFiltered.append(getStudentInfo(student))
                break

            else:
                courseDates.append(course.date)

    return studentsFiltered


def getInconsistencies(students):
    studentsFiltered = list()

    for student in students:
        if (
            student.attendances.filter(
                quota="PAGO", recover=False, onlyday=False
            ).count()
            % 4
            != 0
        ):
            studentsFiltered.append(getStudentInfo(student))

    return studentsFiltered


def getUsersWithoutLevel(students):
    studentsFiltered = list()

    for student in students:

        if not student.levels.filter().exists():
            studentsFiltered.append(getStudentInfo(student))

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
                studentsFiltered.append(getStudentInfo(student))

    return studentsFiltered


def getHundredWithoutCertificate(students):
    studentsFiltered = list()

    for student in students:
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
                studentsFiltered.append(getStudentInfo(student))
                break

    return studentsFiltered


def getNoHundredWithCertificate(students):
    studentsFiltered = list()

    for student in students:
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
                studentsFiltered.append(getStudentInfo(student))
                break

    return studentsFiltered
