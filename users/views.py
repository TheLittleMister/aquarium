from django.shortcuts import render
import datetime
from django.urls import reverse
from django.http import HttpResponseRedirect, JsonResponse
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.contrib.admin.views.decorators import staff_member_required
from users.models import *
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db.models import Q, F
from PIL import Image
from django.utils import timezone
from unidecode import unidecode
from django.contrib.auth.models import BaseUserManager

from courses.forms import *
from .forms import *
from .utils import *
from .labels import *
from courses.models import *

mysite = "https://aquariumschool.co/"
# mysite = "http://127.0.0.1:8000/"

# USER AUTHENTICATION


def redirection(request):

    if request.user.is_admin:
        return HttpResponseRedirect(reverse("courses:students"))

    else:
        return HttpResponseRedirect(reverse("users:profile", args=(request.user.id,)))


def login_view(request):

    response = {
        "user": None,
    }

    post = request.POST.copy()

    post["username"] = str(post["username"]).lower()

    form = AuthenticationForm(data=post)

    if form.is_valid():
        user = form.get_user()
        login(request, user)
        user.real_last_login = timezone.now()
        user.save()
        response["user"] = user.id

    return JsonResponse(response, status=200)


def logout_view(request):
    logout(request)
    return HttpResponseRedirect("/")


def available(request):

    response = {
        "email": None,
        "username": None,
        "identity_document": None,
    }

    if request.GET.get("email", ""):

        email = str(request.GET["email"]).lower()

        try:
            validate_email(email)

            if Account.objects.filter(email=email).exists():
                response["email"] = "Taken"

            else:
                response["email"] = "Not taken"

            if not request.user.is_anonymous:
                if request.user.email == email:
                    response["email"] = False

        except:
            response["email"] = "Invalid"

    if request.GET.get("username", ""):

        username = str(request.GET["username"]).lower()
        user_valid = UnicodeUsernameValidator()

        try:
            user_valid(username)

            if Account.objects.filter(username=username).exists():
                response["username"] = "Taken"

            else:
                response["username"] = "Not taken"

            if not request.user.is_anonymous:
                if request.user.username == username:
                    response["username"] = False

        except:
            response["username"] = "Invalid"

    if request.GET.get("identity_document", "") or request.GET.get(
        "identity_document_1", ""
    ):

        identity_document = int(request.GET["identity_document"])

        try:
            if not str(identity_document).isdigit():  # CHECK THIS!
                raise ValidationError()

            if Account.objects.filter(identity_document=identity_document).exists():
                response["identity_document"] = "Taken"

            else:
                response["identity_document"] = "Not taken"

            if not request.user.is_anonymous:
                if request.user.identity_document == identity_document:
                    response["identity_document"] = False

        except:
            response["identity_document"] = "Invalid"

    return JsonResponse(response, status=200)


# USER PROFILE


def profile(request, user_id):

    user = Account.objects.get(pk=user_id)

    if request.user.is_authenticated:

        if request.user.is_teacher or request.user.is_admin or request.user == user:

            age = (
                round((datetime.date.today() - user.date_birth).days // 365.25)
                if user.date_birth
                else None
            )

            signatureForm = (
                SignatureForm(instance=user) if request.user.is_admin else None
            )

            return render(
                request,
                "users/profile.html",
                {
                    "user": user,
                    "age": age,
                    "profileForm": ProfileForm(instance=user),
                    "signatureForm": signatureForm,
                    "userBar": True,
                },
            )

    return HttpResponseRedirect("/")


def profile_photo(request, user_id):

    user = Account.objects.get(pk=user_id)

    if request.user.is_admin or request.user == user:

        if (
            request.FILES.get("image", False) != False
            and "image" in request.FILES["image"].content_type
        ):

            if user.image != "default-profile.png":
                user.image.delete()

            user.image = request.FILES["image"]
            user.save()  # Can we just pass args to save???

            img = Image.open(user.image.path)

            x = float(request.POST["x"])
            y = float(request.POST["y"])
            h = float(request.POST["h"])
            w = float(request.POST["w"])

            img = img.crop((x, y, w + x, h + y))
            img.save(user.image.path)

    if request.user.is_admin:
        return HttpResponseRedirect(reverse("courses:student", args=(user.id,)))

    else:
        return HttpResponseRedirect(reverse("users:profile", args=(user.id,)))


@staff_member_required(login_url=mysite)
def edit_student(request, user_id):

    response = {
        "edited": False,
        "messages": list(),
    }

    user = Account.objects.get(pk=user_id)
    studentform = StudentForm(request.POST, instance=user)

    if studentform.is_valid():
        user = studentform.save()

        user.email = (
            str(BaseUserManager.normalize_email(user.email)).lower()
            if user.email
            else None
        )

        user.first_name = unidecode(str(user.first_name).upper())
        user.last_name = unidecode(str(user.last_name).upper())

        if user.parent:
            user.parent = unidecode(str(user.parent).upper())

        user.save()

        response["edited"] = True

    else:
        for key in studentform.errors.as_data():
            response["messages"].append(
                str(studentform.errors.as_data()[key][0])[2:-2].replace(
                    "Account", "cuenta"
                )
            )

    return JsonResponse(response, status=200)


@staff_member_required(login_url=mysite)
def default_password(request, user_id):

    user = Account.objects.get(pk=user_id)
    user.set_password("AquariumSchool")
    user.save()

    return HttpResponseRedirect(reverse("courses:student", args=(user_id,)))


@staff_member_required(login_url=mysite)
def delete_student(request, user_id):
    Account.objects.get(pk=user_id).delete()
    return HttpResponseRedirect(reverse("courses:students"))


def edit_profile(request, user_id):

    response = {
        "edited": False,
        "messages": list(),
    }

    user = Account.objects.get(pk=user_id)

    if request.user == user:
        profileform = ProfileForm(request.POST, instance=user)

        if profileform.is_valid():
            user = profileform.save()
            user.newrequest = True

            user.email = (
                str(BaseUserManager.normalize_email(user.email)).lower()
                if user.email
                else None
            )

            if user.first_name_1:
                user.first_name_1 = unidecode(str(user.first_name_1).upper())

            if user.last_name_1:
                user.last_name_1 = unidecode(str(user.last_name_1).upper())

            if user.parent:
                user.parent = unidecode(str(user.parent).upper())

            user.save()
            response["edited"] = True

        else:
            for key in profileform.errors.as_data():
                response["messages"].append(
                    str(profileform.errors.as_data()[key][0])[2:-2].replace(
                        "Account", "cuenta"
                    )
                )

    else:
        response["Privilege"] = "Restricted"

    return JsonResponse(response, status=200)


def cancel_request(request, user_id):

    user = Account.objects.get(pk=user_id)

    if request.user.is_admin or request.user == user:
        user.newrequest = False
        user.save()

    if request.user.is_admin:
        return HttpResponseRedirect(reverse("courses:student", args=(user.id,)))

    else:
        return HttpResponseRedirect(reverse("users:profile", args=(user.id,)))


@staff_member_required(login_url=mysite)
def approve_request(request, user_id):

    user = Account.objects.get(pk=user_id)

    try:
        user.first_name = user.first_name_1
        user.last_name = user.last_name_1
        user.identity_document = user.identity_document_1
        user.phone_1 = user.phone_1_1
        user.phone_2 = user.phone_2_1
        user.save()

    except:
        pass

    user.newrequest = False
    user.save()

    return HttpResponseRedirect(reverse("courses:student", args=(user.id,)))


# TEACHER FUNCTIONS


def create_schedule(request):

    if request.user.is_admin or request.user.is_teacher:

        courses = (
            Account.objects.get(pk=request.GET.get("userID"))
            .teacher_courses.filter(
                date__gte=datetime.datetime.now() - datetime.timedelta(15)
            )
            .order_by("date", "start_time")
        )

        return JsonResponse({"schedule": get_schedule(courses)}, status=200)

    else:
        return JsonResponse({"Privilege": "Restricted"}, status=200)


def change_student_teacher(request, user_id):

    response = dict()

    if request.user.is_admin or request.user.is_teacher:

        student = Account.objects.get(pk=user_id)

        student.teacher = None if student.teacher else request.user

        student.save()

        response["teacher"] = (
            student.teacher.username if student.teacher else "Reclamar"
        )

        response["color"] = (
            student.teacher.color.hex_code
            if student.teacher and student.teacher.color
            else None
        )

        return JsonResponse(response, status=200)

    else:
        return JsonResponse({"Privilege": "Restricted"}, status=200)


@staff_member_required(login_url=mysite)
def signature(request, user_id):

    teacher = Account.objects.get(pk=user_id)

    signatureForm = SignatureForm(request.POST, request.FILES, instance=teacher)

    if signatureForm.is_valid():
        signatureForm.save()

    return HttpResponseRedirect(reverse("users:profile", args=(user_id,)))


# LEVEL FUNCTIONS


def load_level_students(request):

    response = {
        "students": list(),
        "all_loaded": False,
        "levelName": None,
    }

    if request.user.is_admin or request.user.is_teacher:

        start = int(request.GET.get("start"))
        end = int(request.GET.get("end"))
        level_id = int(request.GET.get("levelID"))

        level = Level.objects.get(pk=level_id)
        response["levelName"] = level.name

        filter = int(request.GET.get("filter"))

        if filter == 0:  # TODOS

            if request.user.is_admin:
                response["students"] += list(
                    level.levels.filter(is_active=True)
                    .values(
                        "student__teacher__color__hex_code",
                        "student__teacher__username",
                        "student__id",
                        "student__identity_document",
                        "student__first_name",
                        "student__last_name",
                        "certificate_img",
                        "delivered",
                    )
                    .order_by(F("delivered").desc(nulls_last=True))[start:end]
                )

            else:
                response["students"] += list(
                    level.levels.filter(is_active=True, student__teacher=request.user)
                    .values(
                        "student__teacher__color__hex_code",
                        "student__teacher__username",
                        "student__id",
                        "student__identity_document",
                        "student__first_name",
                        "student__last_name",
                        "certificate_img",
                        "delivered",
                    )
                    .order_by(F("delivered").desc(nulls_last=True))[start:end]
                )

        elif filter == 1:  # CERTIFICADOS
            # MyQuery.query.add_ordering(F("delivered").desc(nulls_last=True))

            if request.user.is_admin:
                response["students"] += list(
                    level.levels.filter(is_active=True)
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
                        "delivered",
                    )
                    .order_by(F("delivered").desc(nulls_last=True))[start:end]
                )

            else:
                response["students"] += list(
                    level.levels.filter(is_active=True, student__teacher=request.user)
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
                        "delivered",
                    )
                    .order_by(F("delivered").desc(nulls_last=True))[start:end]
                )

        elif filter == 2:  # NO CERTIFICADOS

            if request.user.is_admin:
                response["students"] += list(
                    level.levels.filter(is_active=True, certificate_img="")
                    .values(
                        "student__teacher__color__hex_code",
                        "student__teacher__username",
                        "student__id",
                        "student__identity_document",
                        "student__first_name",
                        "student__last_name",
                        "certificate_img",
                        "delivered",
                    )
                    .order_by(F("delivered").desc(nulls_last=True))[start:end]
                )

            else:

                response["students"] += list(
                    level.levels.filter(
                        is_active=True,
                        certificate_img="",
                        student__teacher=request.user,
                    )
                    .values(
                        "student__teacher__color__hex_code",
                        "student__teacher__username",
                        "student__id",
                        "student__identity_document",
                        "student__first_name",
                        "student__last_name",
                        "certificate_img",
                        "delivered",
                    )
                    .order_by(F("delivered").desc(nulls_last=True))[start:end]
                )

        else:

            deliver = None  # Pendiente

            if filter == 3:  # Entregado
                deliver = False

            elif filter == 4:  # No Entregago
                deliver = True

            if request.user.is_admin:
                response["students"] += list(
                    level.levels.filter(is_active=True, delivered=deliver)
                    .values(
                        "student__teacher__color__hex_code",
                        "student__teacher__username",
                        "student__id",
                        "student__identity_document",
                        "student__first_name",
                        "student__last_name",
                        "certificate_img",
                        "delivered",
                    )
                    .order_by(F("delivered").desc(nulls_last=True))[start:end]
                )

            else:
                response["students"] += list(
                    level.levels.filter(
                        is_active=True, delivered=deliver, student__teacher=request.user
                    )
                    .values(
                        "student__teacher__color__hex_code",
                        "student__teacher__username",
                        "student__id",
                        "student__identity_document",
                        "student__first_name",
                        "student__last_name",
                        "certificate_img",
                        "delivered",
                    )
                    .order_by(F("delivered").desc(nulls_last=True))[start:end]
                )

        if end >= level.levels.all().count():
            response["all_loaded"] = True

    else:
        response["Privilege"] = "Restricted"

    return JsonResponse(response, status=200)


def search_level_students(request):

    response = {
        "students": list(),
    }

    if request.user.is_admin or request.user.is_teacher:
        search = request.GET.get("student")
        level_id = int(request.GET.get("levelID"))
        level = Level.objects.get(pk=level_id)

        if len(search) > 1:
            response["students"] += list(
                level.levels.filter(
                    Q(student__username__icontains=search)
                    | Q(student__email__icontains=search)
                    | Q(student__first_name__icontains=search)
                    | Q(student__last_name__icontains=search)
                    | Q(student__identity_document__icontains=search)
                    | Q(student__phone_1__icontains=search)
                    | Q(student__phone_2__icontains=search),
                    is_active=True,
                ).values(
                    "student__teacher__color__hex_code",
                    "student__teacher__username",
                    "student__id",
                    "student__identity_document",
                    "student__first_name",
                    "student__last_name",
                    "certificate_img",
                    "delivered",
                )
            )

    else:
        response["Privilege"] = "Restricted"

    return JsonResponse(response, status=200)


def get_this_percentage(request):

    response = {
        "percentage": 0,
    }

    student_level = Student_Level.objects.get(
        student=request.GET.get("studentID"), level=request.GET.get("levelID")
    )

    percentage = round(
        Attendance.objects.filter(
            course__date__gte=student_level.date,
            student=student_level.student,
            attendance=True,
        ).count()
        * 100
        / student_level.attendances,
        1,
    )

    response["percentage"] = percentage if percentage < 101 else 100

    return JsonResponse(response, status=200)


def change_delivered(request, levelID, studentID):

    response = {
        "delivered": False,
    }

    if request.user.is_admin or request.user.is_teacher:

        student_level = Student_Level.objects.get(student=studentID, level=levelID)

        if student_level.delivered:
            student_level.delivered = False

        elif student_level.delivered == False:
            student_level.delivered = None

        else:
            student_level.delivered = True

        student_level.save()

        response["delivered"] = student_level.delivered

    return JsonResponse(response, status=200)
