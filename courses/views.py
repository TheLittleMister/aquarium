from django.db.models import Count, Exists, OuterRef
import datetime
from django.core.paginator import Paginator

# MODELS
from .models import *
from users.models import *

# FORMS
from .forms import *
from .labels import *
from .utils import *
from users.utils import getFormErrors


# REST FRAMEWORK
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser

# Create your views here.


@api_view(["GET", "POST"])
@permission_classes([IsAdminUser])
def addCourses(request):
    response = {"errors": list()}
    username = request.GET.get("username", "")
    user = Account.objects.get(username=username)

    if request.method == "POST":
        form = CourseForm(request.data)

        if form.is_valid():

            startTime = form.cleaned_data["start_time"]
            endTime = form.cleaned_data["end_time"]
            date = form.cleaned_data["date"]

            course, created = Course.objects.get_or_create(
                start_time=startTime, end_time=endTime, date=date)

        else:
            response["errors"] += getFormErrors(form)
            return Response(response)

    response["courses"] = list(Course.objects.filter(date__gte=datetime.datetime.now()).annotate(count=Count('students'), default=Exists(user.courses.filter(id=OuterRef("pk"))),).values("id", "date", "start_time", "end_time", "count", "default").order_by(
        'date', 'start_time'))

    return Response(response)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def editCourses(request):
    response = {"errors": list()}
    username = request.GET.get("username", "")
    user = Account.objects.get(username=username)

    form = CoursesForm(request.data)

    if form.is_valid():
        query = user.courses.filter(date__gte=datetime.datetime.now())

        removeCourses = set(query) - set(form.cleaned_data["courses"])
        addCourses = set(form.cleaned_data["courses"]) - set(query)

        for course in removeCourses:
            Attendance.objects.get(student=user, course=course).delete()
            user.courses.remove(course)

        for course in addCourses:
            Attendance.objects.create(student=user, course=course)
            user.courses.add(course)

    else:
        response["errors"] += getFormErrors(form)

    return Response(response)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def attendances(request):
    username = request.data["username"]
    user = Account.objects.get(username=username)
    paginatorAmount = 10

    filter = {
        "quota": "PAGO"} if not request.user.is_admin and not request.user.is_teacher else dict()

    values = list()

    if request.user.is_admin:
        values = ["course__id",
                  "course__date",
                  "course__start_time",
                  "course__end_time",
                  "count",
                  "id",
                  "cycle",
                  "end_cycle",
                  "recover",
                  "onlyday",
                  "attendance",
                  "quota",
                  "note"]

        paginatorAmount = 6

    else:
        values = ["id",
                  "course__date",
                  "course__start_time",
                  "course__end_time",
                  "attendance"]

    userAttendances = list(Attendance.objects
                           .filter(student=user, **filter)
                           .annotate(count=Count('course__students'))
                           .values(*values).order_by("-course__date", "-course__start_time"))

    attendancesPaginator = Paginator(userAttendances, paginatorAmount)
    page_num = request.data.get("page")
    page = attendancesPaginator.get_page(page_num)

    return Response({
        "count": attendancesPaginator.count,
        "page": page.object_list,
        "paginationCount": attendancesPaginator.num_pages
    })


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def change(request):
    response = dict()
    attendanceID = request.data["id"]
    attendanceType = request.data["type"]
    attendance = Attendance.objects.get(pk=attendanceID)

    if attendanceType == "attendance":
        attendance.attendance = not attendance.attendance
        response["attendance"] = attendance.attendance

    elif attendanceType == "quota":
        attendance.quota = "PAGO" if attendance.quota == "SEPARADO" else "SEPARADO"
        response["quota"] = attendance.quota

    elif attendanceType == "cycle":
        if not attendance.cycle and not attendance.end_cycle:
            attendance.cycle = True
            # attendance.end_cycle = False

        elif attendance.cycle and not attendance.end_cycle:
            attendance.end_cycle = True
            attendance.cycle = False

        else:
            attendance.cycle = attendance.end_cycle = False

        response["cycle"] = attendance.cycle
        response["endCycle"] = attendance.end_cycle

    elif attendanceType == "day":
        if not attendance.onlyday and not attendance.recover:
            attendance.recover = True
            # attendance.onlyday = False

        elif attendance.recover and not attendance.onlyday:
            attendance.recover = False
            attendance.onlyday = True

        else:
            attendance.onlyday = attendance.recover = False

        response["onlyDay"] = attendance.onlyday
        response["recover"] = attendance.recover

    elif attendanceType == "note":
        attendance.note = request.data["note"]
        response["note"] = attendance.note

    attendance.save()

    return Response(response)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def courses(request):
    filter = dict()
    search = request.data.get("search")
    if search:
        filter["date"] = search.split("T")[0]

    coursesList = list(Course.objects.filter(**filter).annotate(
        count=Count("students")).values(
            "id",
            "date",
            "start_time",
            "end_time",
            "count"
    ).order_by("-date", "-start_time", "-end_time"))

    coursesPaginator = Paginator(coursesList, 14)
    page_num = request.data.get("page")
    page = coursesPaginator.get_page(page_num)

    return Response({
        "page": page.object_list,
        "count": coursesPaginator.count,
        "paginationCount": coursesPaginator.num_pages
    })


@api_view(["GET"])
@permission_classes([IsAdminUser])
def course(request):
    response = {"errors": list()}
    courseID = request.GET.get("id", "")
    course = Course.objects.get(pk=courseID)
    response["course"] = {
        "id": course.id,
        "date": course.date,
        "start_time": course.start_time,
        "end_time": course.end_time,
    }

    if request.method == "GET":
        response["attendances"] = list(Attendance.objects
                                       .filter(course=course)
                                       .annotate(count=Count('course__students'))
                                       .values(
                                           "student__username",
                                           "student__id",
                                           "student__first_name",
                                           "student__last_name",
                                           "student__identity_document",
                                           "count",
                                           "id",
                                           "cycle",
                                           "end_cycle",
                                           "recover",
                                           "onlyday",
                                           "attendance",
                                           "quota",
                                           "note",
                                       ).order_by("student__last_name"))

    return Response(response)


@api_view(["GET", "PUT"])
@permission_classes([IsAdminUser])
def editCourse(request):
    response = {"errors": list()}
    courseID = request.GET.get("id", "")
    course = Course.objects.get(pk=courseID)

    if request.method == "PUT":
        form = CourseForm(request.data, instance=course)

        if form.is_valid():
            startTime = form.cleaned_data["start_time"]
            endTime = form.cleaned_data["end_time"]
            date = form.cleaned_data["date"]

            exists = Course.objects.exclude(pk=course.id).filter(
                start_time=startTime, end_time=endTime, date=date).exists()

            if not exists:
                query = course.students.all()

                removeStudents = set(
                    query) - set(form.cleaned_data["students"])
                addStudents = set(form.cleaned_data["students"]) - set(query)

                for student in removeStudents:
                    Attendance.objects.get(
                        student=student, course=course).delete()
                    course.students.remove(student)

                for student in addStudents:
                    Attendance.objects.create(student=student, course=course)
                    course.students.add(student)

                form.save()

            else:
                response["errors"] += ["Este curso ya existe!"]

        else:
            response["errors"] += getFormErrors(form)

    else:
        response["users"] = list(Account.objects.filter(is_admin=False, is_teacher=False).annotate(default=Exists(course.students.filter(id=OuterRef("pk")))).values(
            "id", "first_name", "last_name", "default").order_by("-date_joined"))

    return Response(response)


@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def deleteCourse(request):
    response = {"errors": list()}
    courseID = request.GET.get("id", "")
    course = Course.objects.get(pk=courseID)

    if not request.user.check_password(request.data["password"]):
        response["errors"].append("Contraseña Incorrecta.")

    else:
        course.delete()

    return Response(response)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def printCourse(request):
    response = {"errors": list()}
    courseID = request.GET.get("id", "")
    course = Course.objects.get(pk=courseID)

    response["attendances"] = getAttendances(course)

    return Response(response)

# PRICE AND SCHEDULE


@api_view(["POST"])
@permission_classes([IsAdminUser])
def price(request):
    response = {"errors": list()}
    newPrice = int(request.data["price"])

    if newPrice > 0:
        price, created = Price.objects.get_or_create(pk=1)
        price.price = newPrice
        price.save()
        response["price"] = newPrice

    else:
        response["errors"].append("Precio debe ser mayor a $0")

    return Response(response)


@api_view(["GET", "POST", "DELETE"])
@permission_classes([IsAdminUser])
def schedules(request):
    response = {"errors": list()}

    if request.method == "GET":
        response["price"] = Price.objects.get(pk=1).price
        response["schedules"] = list(
            Schedule.objects.all().values(
                "id",
                "weekday__weekday",
                "start_time",
                "end_time"
            ).order_by("weekday__day_number", "start_time"))

    elif request.method == "POST":
        if not Weekday.objects.filter(pk=1).exists():
            for key, value in get_weekdays().items():
                Weekday.objects.create(weekday=value, day_number=key)

        form = ScheduleForm(request.data)

        if form.is_valid():
            form.save()

        else:
            response["errors"] += getFormErrors(form)

    elif request.method == "DELETE":
        scheduleID = request.GET.get("id", "")
        Schedule.objects.get(pk=scheduleID).delete()

    return Response(response)


@api_view(["GET"])
def schedulesInfo(request):
    response = {
        "price": Price.objects.get_or_create(pk=1)[0].price,
        "schedules": list(
            Schedule.objects.filter().values(
                "weekday__weekday",
                "start_time",
                "end_time"
            ).order_by("weekday__day_number", "start_time"))
    }

    return Response(response)
