from django.shortcuts import render
import requests
from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse

# Create your views here.


def index(request):
    return render(request, 'main/index.html')

# def ads(request):
#    content = "google.com, pub-9848347625525796, DIRECT, f08c47fec0942fa0"
#    return HttpResponse(content, content_type='text/plain')


def login_view(request):

    if request.method == "POST":

        try:

            secret_key = settings.RECAPTCHA_SECRET_KEY

            # captcha verification
            data = {
                'response': request.POST.get('g-recaptcha-response'),
                'secret': secret_key
            }
            resp = requests.post(
                'https://www.google.com/recaptcha/api/siteverify', data=data)
            result_json = resp.json()

            # print(result_json)

            if not result_json.get('success'):
                return render(request, "courses/login.html", {
                    "message": "Sistema en mantenimiento, inténtalo más tarde",
                    'site_key': settings.RECAPTCHA_SITE_KEY
                })
            # end captcha verification

        except:
            return render(request, "courses/login.html", {
                "message": "Sistema en mantenimiento, inténtalo más tarde"
            })

        username = request.POST["username"].strip()
        password = request.POST["password"]

        user = authenticate(request, username=username, password=password)

        if user is not None and user.is_admin:
            login(request, user)
            return HttpResponseRedirect(reverse("courses:index"))

        elif user is not None and not user.is_admin:
            login(request, user)
            return HttpResponseRedirect(reverse("users:index", args=(user.id,)))

        else:
            return render(request, "main/login.html", {
                "message": "Usuario y/o Contraseña invalidas.",
                'site_key': settings.RECAPTCHA_SITE_KEY
            })
    else:

        if request.user.is_authenticated and request.user.is_admin:
            return HttpResponseRedirect(reverse("courses:index"))

        elif request.user.is_authenticated and not request.user.is_admin:
            return HttpResponseRedirect(reverse("users:index", args=(request.user.id,)))

        else:
            return render(request, "main/login.html", {
                'site_key': settings.RECAPTCHA_SITE_KEY
            })
