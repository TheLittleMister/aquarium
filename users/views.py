from django.shortcuts import render
import unidecode
import datetime
from django import forms
from django.urls import reverse
from django.core.paginator import Paginator
from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.contrib.admin.views.decorators import staff_member_required
from users.models import *
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db.models import Q, Count

from courses.forms import *
from .forms import *
from .utils import *


# USER AUTHENTICATION

def redirection(request):

    if request.user.is_admin:
        return HttpResponseRedirect(reverse("courses:students"))

    else:
        return HttpResponseRedirect(reverse("users:profile", args=(request.user.id,)))


def login_view(request):

    response = {
        'user': None,
    }

    form = AuthenticationForm(data=request.POST)

    if form.is_valid():
        user = form.get_user()
        login(request, user)
        response['user'] = user.id

    return JsonResponse(response, status=200)


def logout_view(request):
    logout(request)
    return HttpResponseRedirect("/")


def available(request):

    response = {
        'email': None,
        'username': None,
        'identity_document': None,
    }

    if request.GET.get("email", ""):

        email = request.GET["email"]

        try:
            validate_email(email)

            if Account.objects.filter(email=email).exists():
                response['email'] = "Taken"

            else:
                response['email'] = "Not taken"

            if not request.user.is_anonymous:
                if request.user.email == email:
                    response['email'] = False

        except:
            response['email'] = "Invalid"

    if request.GET.get("username", ""):

        username = request.GET["username"]
        user_valid = UnicodeUsernameValidator()

        try:
            user_valid(username)

            if Account.objects.filter(username=username).exists():
                response['username'] = "Taken"

            else:
                response['username'] = "Not taken"

            if not request.user.is_anonymous:
                if request.user.username == username:
                    response['username'] = False

        except:
            response['username'] = "Invalid"

    if request.GET.get('identity_document', '') or request.GET.get('identity_document_1', ''):

        identity_document = int(request.GET["identity_document"])

        try:
            if not str(identity_document).isdigit():  # CHECK THIS!
                raise ValidationError()

            if Account.objects.filter(identity_document=identity_document).exists():
                response['identity_document'] = 'Taken'

            else:
                response['identity_document'] = 'Not taken'

            if not request.user.is_anonymous:
                if request.user.identity_document == identity_document:
                    response['identity_document'] = False

        except:
            response['identity_document'] = 'Invalid'

    return JsonResponse(response, status=200)

# USER PROFILE


def profile(request, user_id):

    user = Account.objects.get(pk=user_id)

    if request.user.is_authenticated:

        if request.user.is_teacher or request.user.is_admin or request.user == user:
            return render(request, 'users/profile.html', {
                'user': user,
                'profileForm': ProfileForm(instance=user),
                'userBar': True,
            })

    return HttpResponseRedirect("/")


def profile_photo(request, user_id):

    user = Account.objects.get(pk=user_id)

    if request.user.is_admin or request.user == user:

        if request.FILES.get("image", False) != False and 'image' in request.FILES["image"].content_type:

            if user.image != 'default-profile.png':
                user.image.delete()

            user.image = request.FILES["image"]
            user.save()  # Can we just pass args to save???

            img = Image.open(user.image.path)

            x = float(request.POST["x"])
            y = float(request.POST["y"])
            h = float(request.POST["h"])
            w = float(request.POST["w"])

            img = img.crop((x, y, w+x, h+y))
            img.save(user.image.path)

    if request.user.is_admin:
        return HttpResponseRedirect(reverse('courses:student', args=(user.id,)))

    else:
        return HttpResponseRedirect(reverse('users:profile', args=(user.id,)))


@staff_member_required(login_url="https://aquariumschool.co/")
def edit_student(request, user_id):

    response = {
        'edited': False,
        'messages': list(),
    }

    user = Account.objects.get(pk=user_id)
    studentform = StudentForm(request.POST, instance=user)

    if studentform.is_valid():
        studentform.save()
        response["edited"] = True

    else:
        for key in studentform.errors.as_data():
            response["messages"].append(str(studentform.errors.as_data()[key][0])[
                                        2:-2].replace("Account", "cuenta"))

    return JsonResponse(response, status=200)


@staff_member_required(login_url="https://aquariumschool.co/")
def default_password(request, user_id):

    user = Account.objects.get(pk=user_id)
    user.set_password("AquariumSchool")
    user.save()

    return HttpResponseRedirect(reverse("courses:student", args=(user_id,)))


@staff_member_required(login_url="https://aquariumschool.co/")
def delete_student(request, user_id):
    Account.objects.get(pk=user_id).delete()
    return HttpResponseRedirect(reverse("courses:students"))


def edit_profile(request, user_id):

    response = {
        'edited': False,
        'messages': list(),
    }

    user = Account.objects.get(pk=user_id)

    if request.user == user:
        profileform = ProfileForm(request.POST, instance=user)

        if profileform.is_valid():
            user = profileform.save()
            user.newrequest = True
            user.save()
            response["edited"] = True

        else:
            for key in profileform.errors.as_data():
                response["messages"].append(str(profileform.errors.as_data()[key][0])[
                    2:-2].replace("Account", "cuenta"))

    else:
        response["Privilege"] = "Restricted"

    return JsonResponse(response, status=200)


def cancel_request(request, user_id):

    user = Account.objects.get(pk=user_id)

    if request.user.is_admin or request.user == user:
        user.newrequest = False
        user.save()

    return HttpResponseRedirect(reverse("users:profile", args=(user.id,)))


@staff_member_required(login_url="https://aquariumschool.co/")
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

    return HttpResponseRedirect(reverse("users:profile", args=(user.id,)))

# TEACHER FUNCTIONS


def create_schedule(request):

    if request.user.is_admin or request.user.is_teacher:

        courses = Account.objects.get(pk=request.GET.get("userID")).teacher_courses.filter(
            date__gte=datetime.datetime.now()).order_by('date', 'start_time')

        return JsonResponse({'schedule': get_schedule(courses)}, status=200)

    else:
        return JsonResponse({"Privilege": "Restricted"}, status=200)


# LEVEL FUNCTIONS

def load_level_students(request):

    response = {
        'students': list(),
        'all_loaded': False,
        'levelName': None,
    }

    if request.user.is_admin or request.user.is_teacher:

        start = int(request.GET.get("start"))
        end = int(request.GET.get("end"))
        level_id = int(request.GET.get("levelID"))

        level = Level.objects.get(pk=level_id)
        response["levelName"] = level.name

        response["students"] += list(level.levels.filter(is_active=True).values("student__id", "student__identity_document",
                                                                                "student__first_name", "student__last_name", "student__phone_1", "student__phone_2")[start:end])

        if end >= level.levels.all().count():
            response["all_loaded"] = True

    else:
        response["Privilege"] = "Restricted"

    return JsonResponse(response, status=200)


def search_level_students(request):

    response = {
        'students': list(),
    }

    if request.user.is_admin or request.user.is_teacher:
        search = request.GET.get("student")
        level_id = int(request.GET.get("levelID"))
        level = Level.objects.get(pk=level_id)

        if len(search) > 1:
            response["students"] += list(level.levels.filter(Q(student__username__icontains=search) | Q(student__email__icontains=search) | Q(student__first_name__icontains=search) | Q(student__last_name__icontains=search) | Q(student__identity_document__icontains=search) | Q(
                student__phone_1__icontains=search) | Q(student__phone_2__icontains=search), is_active=True).values("student__id", "student__identity_document", "student__first_name", "student__last_name", "student__phone_1", "student__phone_2"))

    else:
        response["Privilege"] = "Restricted"

    return JsonResponse(response, status=200)
