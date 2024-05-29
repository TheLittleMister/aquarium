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
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken


# USER AUTHENTICATION
@api_view(["POST"])
def login(request):
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
def defaultUserPassword(request):
    response = {"errors": list()}

    username = request.data["username"]
    user = Account.objects.get(username=username)

    if not request.user.check_password(request.data["password"]):
        response["errors"].append("Contraseña Incorrecta.")

    else:
        user.set_password("AquariumSchool")
        user.save()
        response = {"messages": ["Contraseña reseteada!"]}

    return Response(response)


@api_view(["GET", "PUT", "POST"])
@permission_classes([IsAuthenticated])
def profile(request):
    response = {"errors": list()}

    user = request.user
    username = request.GET.get("username", "")

    if username and (request.user.is_admin or request.user.is_teacher):
        user = Account.objects.get(username=username)

    if request.method == "GET":
        return Response(getUser(user))

    data = request.data.copy()
    data["username"] = str(data["username"]).strip().lower()

    if request.method == "PUT":
        form = ProfileForm(data=data, instance=user)

    elif request.method == "POST" and request.user.is_admin:
        form = ProfileForm(data=data)

    else:
        response["errors"] += ["403 (Forbidden)"]
        return Response(response)

    if form.is_valid():
        user = form.save(commit=False)

        user.email = (
            str(BaseUserManager.normalize_email(user.email)).lower()
            if user.email
            else None
        )

        user.first_name = unidecode(str(user.first_name).upper())
        user.last_name = unidecode(str(user.last_name).upper())

        if user.parent:
            user.parent = unidecode(str(user.parent).upper())

        if request.method == "POST" and request.user.is_admin:
            user.set_password("AquariumSchool")

        user.save()

        response = getUser(user)

    else:
        response["errors"] += getFormErrors(form)

    return Response(response)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def users(request):
    # response = {"errors": list()}

    search = " ".join(request.data.get("search").split())
    userType = request.data.get("type")
    order = request.data.get("order")
    filter = dict()
    qObjects = Q()

    if search:
        filters = ["full_name__icontains",
                   "username__icontains",
                   "email__icontains",
                   "id_document__icontains",
                   "parent__icontains",
                   "phone_1__icontains",
                   "phone_2__icontains"]

        tags = [{filter: search} for filter in filters]

        for tag in tags:
            qObjects |= Q(**tag)

    if userType == 1:
        filter["is_admin"] = False
        filter["is_teacher"] = False

    elif userType == 2:
        filter["is_admin"] = False
        filter["is_teacher"] = True

    elif userType == 3:
        filter["is_admin"] = True
        filter["is_teacher"] = False

    elif userType == 4:
        filter["is_admin"] = False
        filter["is_teacher"] = False
        filter["attendances__course__date__gte"] = datetime.datetime.now()
        filter["attendances__quota"] = "PAGO"

    elif userType == 5:
        filter["is_admin"] = False
        filter["is_teacher"] = False
        filter["teacher__isnull"] = True
        filter["attendances__course__date__gte"] = datetime.datetime.now()

    if userType in [1, 2, 3, 4, 5]:
        accounts = list(Account.objects.annotate(
            full_name=Concat("first_name", Value(" "), "last_name"),
        ).filter(qObjects, **filter).values("username", "id", "id_document", "first_name", "last_name",
                                            "phone_1", "last_session").order_by(F(order).desc(nulls_last=True) if order == "last_session" or order == "date_joined" else order).distinct())

    else:
        filter["is_admin"] = False
        filter["is_teacher"] = False
        filter["courses__date__gte"] = datetime.datetime.now()

        accountObjects = Account.objects.annotate(
            full_name=Concat("first_name", Value(" "), "last_name"),
        ).filter(qObjects, **filter).order_by(F(order).desc(
            nulls_last=True) if order == "last_session" or order == "date_joined" else order).distinct()

        if userType == 6:
            accounts = getPlus(accountObjects)

        elif userType == 7:
            accounts = getInconsistencies(accountObjects)

        elif userType == 8:
            accounts = getUsersWithoutLevel(accountObjects)

        elif userType == 9:
            accounts = getHundredWithoutCertificate(accountObjects)

        elif userType == 10:
            accounts = getNoHundredWithCertificate(accountObjects)

    accountPaginator = Paginator(accounts, 14)
    page_num = request.data.get("page")
    page = accountPaginator.get_page(page_num)

    return Response({
        "page": page.object_list,
        "count": accountPaginator.count,
        "paginationCount": accountPaginator.num_pages
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def changePhoto(request):
    response = {"url": "", "field": "profile_image"}

    user = request.user
    username = request.data["username"]

    if request.user.is_admin:
        user = Account.objects.get(username=username)

    if (
        request.FILES.get("profile_image", False) != False
        and "profile_image" in request.FILES["profile_image"].content_type
    ):
        user.profile_image.save("profile.png", request.FILES["profile_image"])
        response["url"] = mysite + user.profile_image.url

    return Response(response)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def changeSignature(request):
    response = {"url": "", "field": "signature"}

    username = request.data["username"]
    user = Account.objects.get(username=username)

    if (
        request.FILES.get("profile_image", False) != False
        and "profile_image" in request.FILES["profile_image"].content_type
    ):
        user.signature.save("signature.png", request.FILES["profile_image"])
        response["url"] = mysite + user.signature.url

    return Response(response)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def changeRole(request):
    response = {"errors": list()}

    username = request.data["username"]
    user = Account.objects.get(username=username)

    if not request.user.check_password(request.data["password"]):
        response["errors"].append("Contraseña Incorrecta.")

    else:
        type = request.data["radio-buttons-group"]
        user.is_admin = False
        user.is_staff = False
        user.is_superuser = False
        user.is_teacher = False

        if type == "Profesor":
            user.is_teacher = True

        elif type == "Administrador":
            user.is_admin = True
            user.is_staff = True
            user.is_superuser = True

        user.save()

        if not user.is_teacher:
            for account in Account.objects.filter(teacher=user):
                account.teacher = None
                account.save()

        response["type"] = type

    return Response(response)


@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def deleteProfile(request):
    response = {"errors": list()}

    username = request.data["username"]
    user = Account.objects.get(username=username)

    if not request.user.check_password(request.data["password"]):
        response["errors"].append("Contraseña Incorrecta.")

    else:
        user.delete()

    return Response(response)


@api_view(["GET", "POST"])
@permission_classes([IsAdminUser])
def teacher(request):

    response = {"teachers": list()}

    if request.method == "GET":

        response["teachers"] += list(Account.objects.filter(is_admin=False, is_teacher=True).annotate(
            label=Concat("first_name", Value(" "), "last_name")).values("label", "id").order_by("id"))

    else:

        username = request.data["username"]
        user = Account.objects.get(username=username)
        teacher = request.data["teacher"]

        if teacher:
            teacher = Account.objects.get(pk=teacher["id"])

        user.teacher = teacher
        user.save()

        response["teacher"] = teacher.first_name + \
            " " + teacher.last_name if teacher else ""

        response["teacherID"] = teacher.id if user.teacher else ""

    return Response(response)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def students(request):

    if request.user.is_teacher:
        search = " ".join(request.data.get("search").split())
        userType = request.data.get("type")
        order = request.data.get("order")
        filter = {"teacher": request.user}
        qObjects = Q()

        if search:
            filters = ["full_name__icontains",
                       "username__icontains",
                       "email__icontains",
                       "id_document__icontains",
                       "parent__icontains",
                       "phone_1__icontains",
                       "phone_2__icontains"]

            tags = [{filter: search} for filter in filters]

            for tag in tags:
                qObjects |= Q(**tag)

        if userType == 1:
            filter["is_admin"] = False
            filter["is_teacher"] = False

        if userType in [1]:
            accounts = list(Account.objects.annotate(
                full_name=Concat("first_name", Value(" "), "last_name"),
            ).filter(qObjects, **filter).values("username", "id", "id_document", "first_name", "last_name",
                                                "phone_1", "last_session").order_by(F(order).desc(nulls_last=True) if order == "last_session" or order == "date_joined" else order).distinct())

        else:
            filter["is_admin"] = False
            filter["is_teacher"] = False
            filter["courses__date__gte"] = datetime.datetime.now()

            accountObjects = Account.objects.annotate(
                full_name=Concat("first_name", Value(" "), "last_name"),
            ).filter(qObjects, **filter).order_by(F(order).desc(
                nulls_last=True) if order == "last_session" or order == "date_joined" else order).distinct()

            if userType == 8:
                accounts = getUsersWithoutLevel(accountObjects)

            elif userType == 9:
                accounts = getHundredWithoutCertificate(accountObjects)

        accountPaginator = Paginator(accounts, 14)
        page_num = request.data.get("page")
        page = accountPaginator.get_page(page_num)

        return Response({
            "page": page.object_list,
            "count": accountPaginator.count,
            "paginationCount": accountPaginator.num_pages
        })

    else:
        return Response({"errors": ["403 (Forbidden)"]})
