from django.urls import path
from django.shortcuts import render
from . import views

from django.views.generic import TemplateView
from django.contrib.auth import views as auth_views

# app_name = "main"

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("ads.txt", lambda request: render(request, "ads.txt", content_type="text/plain"), name="ads"),

    path('reset_password/', auth_views.PasswordResetView.as_view(template_name ="reset_password.html"), name ='reset_password'),
    path('reset_password_sent/', auth_views.PasswordResetDoneView.as_view(template_name = "password_reset_sent.html"), name ='password_reset_done'),
    path('reset/<uidb64>/<token>', auth_views.PasswordResetConfirmView.as_view(template_name = "password_reset_form.html"), name ='password_reset_confirm'),
    path('reset_password_complete/', auth_views.PasswordResetCompleteView.as_view(template_name = "password_reset_done.html"), name ='password_reset_complete')
]
