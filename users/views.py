from django.contrib.auth.forms import AuthenticationForm, PasswordChangeForm
from users.models import *
from django.db.models import Q, F
from django.utils import timezone
from unidecode import unidecode
from django.contrib.auth.models import BaseUserManager
from django.db.models.functions import Concat
from django.db.models import Value
from django.core.paginator import Paginator

from courses.forms import *
from .forms import *
from .utils import *
from .labels import *
from courses.models import *

# REST FRAMEWORK
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken


# USER AUTHENTICATION
@api_view(["GET", "POST"])
def login(request):

    if request.method == "GET":
        return Response(getUser(request.user))

    response = {"errors": list()}
    post = request.data.copy()
    post["username"] = str(post["username"]).strip().lower()
    form = AuthenticationForm(data=post)

    if form.is_valid():
        user = form.get_user()
        refresh = RefreshToken.for_user(user)
        response = {
            "user": getUser(user),
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
        }
        user.last_session = timezone.now()
        user.save()

    else:
        response["errors"] += getFormErrors(form)

    return Response(response)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def changePassword(request):
    response = {"errors": list()}

    form = PasswordChangeForm(user=request.user, data=request.data)

    if form.is_valid():
        form.save()  # update_session_auth_hash(request, form.user)
        response = {"messages": ["Contraseña Actualizada!"]}

    else:
        response["errors"] += getFormErrors(form)

    return Response(response)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def resetUserPassword(request):
    response = {"errors": list()}

    username = request.data["username"]
    user = Account.objects.get(username=username)

    if not request.user.check_password(request.data["password"]):
        response["errors"].append("Contraseña Incorrecta.")

    elif user.id_document:
        user.set_password(str(user.id_document))
        user.save()
        response = {"messages": ["Contraseña reseteada!"]}

    else:
        response["errors"].append("El usuario debe tener número de documento.")

    return Response(response)


@api_view(["GET", "POST", "PUT", "DELETE"])  # PATCH (?)
@permission_classes([IsAdminUser])
def user(request):
    response = {"errors": list()}
    user = request.user
    username = request.GET.get("username", "")

    if username:
        user = Account.objects.get(username=username)

    if request.method == "GET":
        return Response(getUser(user))

    elif request.method == "DELETE":
        if request.user.check_password(request.data["password"]):
            user.delete()
        else:
            response["errors"].append("Contraseña Incorrecta.")

        return Response(response)

    else:
        data = request.data.copy()

        userForm = UserAdminForm(data={**data, "type": user.type},
                                 instance=user) if request.method == "PUT" else UserAdminForm(data=data)

        if userForm.is_valid():
            user = userForm.save(commit=False)

            user.email = BaseUserManager.normalize_email(
                user.email).lower() if user.email else None
            user.first_name = unidecode(user.first_name).upper()
            user.last_name = unidecode(user.last_name).upper()

            if user.id_document and request.method == "POST":
                user.set_password(str(user.id_document))

            if user.type == "Estudiante":

                studentForm = StudentAdminForm(
                    data=data, instance=user.student if request.method == "PUT" else None)

                if studentForm.is_valid():
                    student = studentForm.save(commit=False)

                    if request.method == "POST":
                        student.user = user

                    student.parent_name = unidecode(
                        student.parent_name).upper() if student.parent_name else ""

                    user.save()
                    student.save()
                    return Response(getUser(user))

                else:
                    response["errors"] += getFormErrors(studentForm)
                    return Response(response)

            elif user.type == "Profesor":
                # Future TeacherForm(data=data)
                user.save()

                if request.method == "POST":
                    Teacher.objects.create(user=user)

                return Response(getUser(user))

            elif user.type == "Administrador":
                user.save()
                return Response(getUser(user))

        else:
            response["errors"] += getFormErrors(userForm)
            return Response(response)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def users(request):
    # response = {"errors" : list() }
    model = Student
    search = " ".join(request.data.get("search").split())
    filterOption = request.data.get("filter")
    order = request.data.get("order")
    filter = dict()
    qObjects = Q()

    valuesList = ["user__username", "user__id", "user__id_document", "user__first_name", "user__last_name",
                  "user__phone_number", "user__last_session"]

    values = {value: F(value) for value in valuesList}

    orders = ["user__last_session", "user__date_joined"]

    annotations = {"full_name": Concat(
        "user__first_name", Value(" "), "user__last_name")}

    filters = ["full_name__icontains",
               "user__username__icontains",
               "user__email__icontains",
               "user__id_document__icontains",
               "user__phone_number__icontains"]

    if filterOption == 1:
        filters += ["parent_name__icontains", "phone_number_2__icontains"]

    elif filterOption == 2:
        model = Teacher

    elif filterOption == 3:
        model = Account
        filter["type"] = "Administrador"
        order = order[6:]
        values = {value: F(value[6:]) for value in valuesList}
        orders = ["last_session", "date_joined"]
        annotations = {"full_name": Concat(
            "first_name", Value(" "), "last_name")}
        filters = [filter.replace("user__", "") for filter in filters]

    else:
        filter["attendances__course__date__gte"] = datetime.datetime.now()

    if filterOption == 4:
        filter["attendances__quota"] = "PAGO"
        filter["courses__date__gte"] = datetime.datetime.now()

    elif filterOption == 5:
        filter["teacher__isnull"] = True
        filter["courses__date__gte"] = datetime.datetime.now()

    if search:
        tags = [{
            filter:
            search} for filter in filters]

        for tag in tags:
            qObjects |= Q(**tag)

    results = model.objects.annotate(**annotations).filter(qObjects, **filter).values(
        **values).order_by(F(order).desc(nulls_last=True) if order in orders else order).distinct()

    if filterOption == 6:
        results = getPlus(results)

    elif filterOption == 7:
        results = getInconsistencies(results)

    elif filterOption == 8:
        results = getUsersWithoutLevel(results)

    elif filterOption == 9:
        results = getHundredWithoutCertificate(results)

    elif filterOption == 10:
        results = getNoHundredWithCertificate(results)

    userPaginator = Paginator(list(results), 14)
    page_num = request.data.get("page")
    page = userPaginator.get_page(page_num)

    return Response({
        "page": page.object_list,
        "count": userPaginator.count,
        "paginationCount": userPaginator.num_pages
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def changePhoto(request):
    response = {"url": "", "field": "profileImage"}

    user = request.user
    username = request.data["username"]

    if request.user.is_admin:
        user = Account.objects.get(username=username)

    if (
        request.FILES.get("image", False) != False
        and "image" in request.FILES["image"].content_type
    ):
        user.profile_image.save("profile.png", request.FILES["image"])
        response["url"] = mysite + user.profile_image.url

    return Response(response)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def changeSignature(request):
    response = {"url": "", "field": "eSignature"}

    username = request.data["username"]
    teacher = Teacher.objects.get(user__username=username)

    if (
        request.FILES.get("image", False) != False
        and "image" in request.FILES["image"].content_type
    ):
        teacher.e_signature.save("signature.png", request.FILES["image"])
        response["url"] = mysite + teacher.e_signature.url

    return Response(response)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def teacher(request):
    response = {"teachers": list()}

    response["teachers"] += list(Teacher.objects.all().annotate(  # all() ???
        label=Concat("user__first_name", Value(" "), "user__last_name")).values("label", "id").order_by("label"))

    username = request.GET.get("username", "")
    if username:
        student = Student.objects.get(user__username=username)
        response["teacherID"] = student.teacher.id if student.teacher else ""

    return Response(response)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def userUpdate(request):
    response = {"errors": list()}
    user = request.user
    userForm = UserForm(data=request.data, instance=user)

    if userForm.is_valid():
        user = userForm.save(commit=False)

        user.email = BaseUserManager.normalize_email(
            user.email).lower() if user.email else None
        user.first_name = unidecode(user.first_name).upper()
        user.last_name = unidecode(user.last_name).upper()

        if user.type == "Estudiante":
            studentForm = StudentForm(data=request.data, instance=user.student)

            if studentForm.is_valid():
                student = studentForm.save(commit=False)
                student.parent_name = unidecode(
                    student.parent_name).upper() if student.parent_name else ""

                user.save()
                student.save()
                return Response(getUser(user))

            else:
                response["errors"] += getFormErrors(studentForm)
                return Response(response)

        elif user.type == "Profesor":
            user.save()
            return Response(getUser(user))

    else:
        response["errors"] += getFormErrors(userForm)
        return Response(response)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def students(request):

    if request.user.type == "Profesor":
        if request.method == "GET":
            return Response(getUser(Account.objects.get(username=request.GET.get("username", ""))))

        search = " ".join(request.data.get("search").split())
        filterOption = request.data.get("filter")
        order = request.data.get("order")
        filter = {"teacher": request.user.teacher}
        qObjects = Q()

        valuesList = ["user__username", "user__id", "user__id_document", "user__first_name", "user__last_name",
                      "user__phone_number", "user__last_session"]

        values = {value: F(value) for value in valuesList}

        orders = ["user__last_session", "user__date_joined"]

        annotations = {"full_name": Concat(
            "user__first_name", Value(" "), "user__last_name")}

        filters = ["full_name__icontains",
                   "user__username__icontains",
                   "user__email__icontains",
                   "user__id_document__icontains",
                   "user__phone_number__icontains",
                   "parent_name__icontains",
                   "phone_number_2__icontains"]

        if search:
            tags = [{
                filter:
                search} for filter in filters]

            for tag in tags:
                qObjects |= Q(**tag)

        if filterOption != 1:
            filter["courses__date__gte"] = datetime.datetime.now()

        results = Student.objects.annotate(**annotations).filter(qObjects, **filter).values(
            **values).order_by(F(order).desc(nulls_last=True) if order in orders else order).distinct()

        if filterOption == 2:
            results = getUsersWithoutLevel(results)

        elif filterOption == 3:
            results = getHundredWithoutCertificate(results)

        userPaginator = Paginator(list(results), 14)
        page_num = request.data.get("page")
        page = userPaginator.get_page(page_num)

        return Response({
            "page": page.object_list,
            "count": userPaginator.count,
            "paginationCount": userPaginator.num_pages
        })

    else:
        Response({}, status=status.HTTP_403_FORBIDDEN)
