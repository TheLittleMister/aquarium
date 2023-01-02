from django.db.models import Count, Exists, OuterRef
from PIL import Image, ImageFont, ImageDraw
import datetime
from io import BytesIO
from django.core.files import File
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

    else:
        values = ["id",
                  "course__date",
                  "course__start_time",
                  "course__end_time",
                  "attendance"]

    userAttendances = list(Attendance.objects
                           .filter(student=user, **filter)
                           .annotate(count=Count('course__students'))
                           .values(*values).order_by("-course__date"))

    attendancesPaginator = Paginator(userAttendances, 6)
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

# LEVELS


@api_view(["GET"])
@permission_classes([IsAdminUser])
def category(request):
    categoryID = request.GET.get("id", "")
    category = Category.objects.get(pk=categoryID)

    return Response({"positions": category.levels.all().count()})


@api_view(["GET"])
@permission_classes([IsAdminUser])
def tasks(request):
    levelID = request.GET.get("levelID", "")
    tasks = list(Level.objects.get(pk=levelID).tasks.all().values(
        "id", "task").order_by("id"))

    return Response({"tasks": tasks})


@api_view(["POST", "PUT"])
@permission_classes([IsAdminUser])
def task(request):
    response = {"errors": list()}

    task = request.data["task"]

    if task:
        if request.method == "POST":
            levelID = request.data["levelID"]
            level = Level.objects.get(pk=levelID)
            Task.objects.create(level=level, task=task)

        elif request.method == "PUT":
            taskID = request.GET.get("id")
            taskObj = Task.objects.get(pk=taskID)
            taskObj.task = task
            taskObj.save()

    else:
        response["errors"].append("Actividad requerida.")

    return Response(response)


@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def deleteTask(request):
    taskID = request.GET.get("id")
    Task.objects.get(pk=taskID).delete()
    return Response({"Deleted": True})


@api_view(["GET", "POST", "PUT"])
@permission_classes([IsAuthenticated])
def level(request):
    response = {"errors": list()}

    if request.user.is_admin or request.user.is_teacher:

        if request.method == "GET":
            response["levels"] = list(Level.objects.all().values(
                "id", "name", "category__name", "category__id", "position").order_by("category__id", "position"))

    else:
        response["errors"] += ["403 (Forbidden)"]

    if request.user.is_admin:
        if request.method == "POST":
            form = LevelForm(request.data)

            if form.is_valid():
                position = int(form.cleaned_data["position"])
                category = form.cleaned_data["category"]

                for level in Level.objects.filter(category=category, position__gte=position):
                    level.position += 1
                    level.save()

                form.save()

            else:
                response["errors"] += getFormErrors(form)

        if request.method == "PUT":
            levelID = request.GET.get("id", "")
            level = Level.objects.get(pk=levelID)
            levelPosition = level.position
            levelCategory = level.category
            form = LevelForm(request.data, instance=level)

            if form.is_valid():
                targetPosition = int(request.data["position"])
                category = Category.objects.get(
                    pk=int(request.data["category"]))

                if levelCategory == category:

                    if targetPosition > levelPosition:

                        for level in Level.objects.filter(category=category, position__gt=levelPosition, position__lte=targetPosition):
                            level.position -= 1
                            level.save()

                    elif targetPosition < levelPosition:
                        for level in Level.objects.filter(category=category, position__gte=targetPosition, position__lt=levelPosition):
                            level.position += 1
                            level.save()

                else:
                    for level in Level.objects.filter(category=category, position__gte=targetPosition):
                        level.position += 1
                        level.save()

                    for level in Level.objects.filter(category=levelCategory, position__gt=levelPosition):
                        level.position -= 1
                        level.save()

                form.save()

            else:
                response["errors"] += getFormErrors(form)
    else:
        response["errors"] += ["403 (Forbidden)"]

    return Response(response)


@api_view(["GET"])
def levelsInfo(request):
    response = {"levels": list()}
    for level in Level.objects.filter(category=Category.objects.get(name=request.GET.get("category", ""))):
        response["levels"].append(
            {"name": level.name, "content": list(level.tasks.all().values("task"))})

    return Response(response)


@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def deleteLevel(request):
    response = {"errors": list()}
    levelID = request.GET.get("id", "")
    level = Level.objects.get(pk=levelID)

    if not request.user.check_password(request.data["password"]):
        response["errors"].append("Contraseña Incorrecta.")

    else:
        for levelObj in Level.objects.filter(category=level.category, position__gt=level.position):
            levelObj.position -= 1
            levelObj.save()

        level.delete()

    return Response(response)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def price(request):
    response = {"errors": list()}
    newPrice = int(request.data["price"])

    if newPrice > 0:
        price = Price.objects.get(pk=1)
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
        "price": Price.objects.get(pk=1).price,
        "schedules": list(
            Schedule.objects.all().values(
                "weekday__weekday",
                "start_time",
                "end_time"
            ).order_by("weekday__day_number", "start_time"))
    }

    return Response(response)


@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def studentLevel(request):
    response = {"errors": list()}

    if request.method == "GET":
        response["studentLevels"] = list()

        for studentLevel in Student_Level.objects.filter(student=request.GET.get("userID", "")).order_by("level__category__id", "level__position"):

            attendances_count = Attendance.objects.filter(
                quota="PAGO",
                course__date__gte=studentLevel.date,
                student=request.GET.get("userID", ""),
                attendance=True,
            ).count()

            percentage = round(
                attendances_count
                * 100
                / studentLevel.attendances,
                1,
            )

            values = dict()

            if request.user.is_teacher or request.user.is_admin:
                values = {
                    "id": studentLevel.id,
                    "level__id": studentLevel.level.id,
                    "level__category__id": studentLevel.level.category.id,
                    "level__name": studentLevel.level.name,
                    "date": studentLevel.date,
                    "attendances": studentLevel.attendances,
                    "certificate_img": studentLevel.certificate_img.url if studentLevel.certificate_img else "",
                    "certificate_pdf": studentLevel.certificate_pdf.url if studentLevel.certificate_pdf else "",
                    "percentage": percentage if percentage < 101 else 100,
                    "attendances_count": attendances_count
                }

            else:
                values = {
                    "id": studentLevel.id,
                    "level__id": studentLevel.level.id,
                    "level__category__id": studentLevel.level.category.id,
                    "level__name": studentLevel.level.name,
                    "certificate_img": studentLevel.certificate_img.url if studentLevel.certificate_img else "",
                    "certificate_pdf": studentLevel.certificate_pdf.url if studentLevel.certificate_pdf else "",
                    "percentage": percentage if percentage < 101 else 100,
                }

            response["studentLevels"].append(values)

    if request.user.is_admin or request.user.is_teacher:

        if request.method == "POST":
            form = StudentLevelForm(request.data)

            if form.is_valid():

                student = Account.objects.get(pk=request.data["student"])

                if student.teacher == request.user:
                    if not Student_Level.objects.filter(student=request.data["student"], level=request.data["level"]).exists():
                        form.save()

                    else:
                        response["errors"] += ["Nivel ya está activo"]

                else:
                    response["errors"] += ["Debe ser profesor de este estudiante"]

            else:
                response["errors"] += getFormErrors(form)

        if request.method == "PUT":
            student = Account.objects.get(pk=request.data["student"])
            studentLevelID = request.GET.get("id", "")
            studentLevel = Student_Level.objects.get(pk=studentLevelID)

            if student.teacher == request.user:

                if not studentLevel.certificate_img:
                    form = StudentLevelForm(
                        request.data, instance=studentLevel)

                    if form.is_valid():
                        form.save()

                    else:
                        response["errors"] += getFormErrors(form)

                else:
                    response["errors"] += ["Este nivel ya está certificado"]

            else:
                response["errors"] += ["Debe ser profesor de este estudiante"]

        if request.method == "DELETE":

            student = Account.objects.get(pk=request.data["userID"])
            studentLevelID = request.data["studentLevelID"]
            studentLevel = Student_Level.objects.get(pk=studentLevelID)

            if student.teacher == request.user:

                if not studentLevel.certificate_img:
                    if not request.user.check_password(request.data["password"]):
                        response["errors"].append("Contraseña Incorrecta.")

                    else:
                        studentLevel.delete()

                else:
                    response["errors"] += ["Este nivel ya está certificado"]

            else:
                response["errors"] += ["Debe ser profesor de este estudiante"]

    else:
        response["errors"] += ["403 (Forbidden)"]

    return Response(response)


@api_view(["POST", "DELETE"])
@permission_classes([IsAuthenticated])
def certificate(request):
    response = {"errors": list()}

    if request.user.is_admin or request.user.is_teacher:

        student = Account.objects.get(pk=request.data["userID"])
        student_level = Student_Level.objects.get(
            pk=request.data["studentLevelID"])

        if request.user == student.teacher:

            if request.user.signature:
                if request.method == "POST":
                    img_src = (
                        "media/certificate.png"
                        if student_level.student.date_birth
                        and round(
                            (datetime.date.today() -
                             student_level.student.date_birth).days
                            // 365.25
                        )
                        > 6
                        else "media/certificate_kids.png"
                    )

                    img = Image.open(img_src)
                    draw = ImageDraw.Draw(img)

                    # STUDENT NAME
                    font_src = "templates/static/fonts/algerian.ttf"
                    font = ImageFont.truetype(font_src, 28)
                    text = f"{student_level.student.first_name} {student_level.student.last_name}".upper(
                    )
                    x, y = font.getsize(text)
                    draw.text(((img.width // 2) - (x // 2), 370),
                              text, (24, 57, 100), font=font)

                    # LEVEL NAME
                    font_src = "templates/static/fonts/tcm.ttf"
                    font = ImageFont.truetype(font_src, 23)
                    text = f"POR HABER COMPLETADO {student_level.level.name}".upper(
                    )
                    x, y = font.getsize(text)
                    draw.text(((img.width // 2) - (x // 2), 450),
                              text, (83, 83, 83), font=font)

                    # TEACHER AND ADMIN NAMES WITH SIGNATURES
                    font = ImageFont.truetype(font_src, 17)
                    text = f"{request.user.first_name} {request.user.last_name}".upper()
                    draw.text((230, 620), text, (83, 83, 83), font=font)
                    teacher_signature = (
                        Image.open(request.user.signature.path)
                        if request.user.signature
                        else None
                    )

                    if teacher_signature:
                        img.paste(teacher_signature, (230, 535))

                    admin = Account.objects.filter(is_admin=True).first()
                    text = f"{admin.first_name} {admin.last_name}"
                    draw.text((580, 620), text, (83, 83, 83), font=font)
                    admin_signature = (
                        Image.open(admin.signature.path)
                        if admin.signature
                        else None
                    )

                    if admin_signature:
                        img.paste(admin_signature, (580, 535))

                    # DATE
                    day = str(datetime.date.today().strftime("%d")).upper()
                    month = get_month(
                        str(datetime.date.today().strftime("%B").upper()))
                    year = str(datetime.date.today().strftime("%Y")).upper()
                    text = day + " DE " + month + " DEL " + year
                    x, y = font.getsize(text)
                    draw.text(((img.width // 2) - (x // 2), 695),
                              text, (83, 83, 83), font=font)

                    blob = BytesIO()
                    img.save(blob, "PNG")
                    student_level.certificate_img.save(
                        "certificate.png", File(blob))

                    blob = BytesIO()
                    img.save(blob, "PDF")
                    student_level.certificate_pdf.save(
                        "certificate.pdf", File(blob))

                if request.method == "DELETE":
                    if not request.user.check_password(request.data["password"]):
                        response["errors"].append("Contraseña Incorrecta.")

                    else:
                        student_level.certificate_img.delete()
                        student_level.certificate_pdf.delete()
                        student_level.save()

            else:
                response["errors"] += ["Debe tener una firma digital"]
        else:
            response["errors"] += ["Debe ser profesor de este estudiante"]

    else:
        response["errors"] += ["403 (Forbidden)"]

    return Response(response)
