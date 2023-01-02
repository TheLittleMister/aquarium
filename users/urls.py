from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

app_name = "users"

urlpatterns = [
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("changePassword/", changePassword, name="changePassword"),
    path("defaultUserPassword/", defaultUserPassword, name="defaultUserPassword"),

    path("login/", login, name="login"),
    path("profile/", profile, name="profile"),
    path("users/", users, name="users"),
    path("students/", students, name="students"),
    path("changePhoto/", changePhoto, name="changePhoto"),
    path("changeSignature/", changeSignature, name="changeSignature"),
    path("changeRole/", changeRole, name="changeRole"),
    path("deleteProfile/", deleteProfile, name="deleteProfile"),
    path("teacher/", teacher, name="teacher"),
]
