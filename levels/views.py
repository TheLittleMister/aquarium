from PIL import Image, ImageFont, ImageDraw
import datetime
from io import BytesIO
from django.core.files import File

# MODELS
from .models import *
from courses.models import *

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


@api_view(["GET"])
@permission_classes([IsAdminUser])
def category(request):
    categoryID = request.GET.get("id", "")
    category = Category.objects.get(pk=categoryID)
    return Response({"positions": category.levels.all().count()})


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
    category, created = Category.objects.get_or_create(
        name=request.GET.get("category", ""))
    for level in Level.objects.filter(category=category):
        response["levels"].append(
            {"name": level.name, "content": list(level.tasks.all().values("task"))})

    return Response(response)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def tasks(request):
    levelID = request.GET.get("levelID", "")
    tasks = list(Level.objects.get(pk=levelID).tasks.all().values(
        "id", "task").order_by("id"))

    return Response({"tasks": tasks})


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

            percentage = percentage if percentage < 101 else 100

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
                    "percentage": percentage,
                    "attendances_count": attendances_count if percentage < 100 else studentLevel.attendances
                }

            else:
                values = {
                    "id": studentLevel.id,
                    "level__id": studentLevel.level.id,
                    "level__category__id": studentLevel.level.category.id,
                    "level__name": studentLevel.level.name,
                    "certificate_img": studentLevel.certificate_img.url if studentLevel.certificate_img else "",
                    "certificate_pdf": studentLevel.certificate_pdf.url if studentLevel.certificate_pdf else "",
                    "percentage": percentage,
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
                    teacher_signature = (Image.open(request.user.signature.path)
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
