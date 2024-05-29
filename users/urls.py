from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

app_name = "users"

urlpatterns = [
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("changePassword/", changePassword, name="changePassword"),
    path("resetUserPassword/", resetUserPassword, name="resetUserPassword"),

    path("login/", login, name="login"),
    path("user/", user, name="user"),
    path("users/", users, name="users"),
    path("userUpdate/", userUpdate, name="userUpdate"),
    path("changePhoto/", changePhoto, name="changePhoto"),
    path("changeSignature/", changeSignature, name="changeSignature"),
    path("teacher/", teacher, name="teacher"),

    path("students/", students, name="students"),
]
