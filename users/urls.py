from django.urls import path
from .views import *

from django.urls import reverse_lazy
from django.contrib.auth import views as auth_views

app_name = "users"

urlpatterns = [
    # USER PATHS
    path("profile/", profile, name="profile"),
    path("profile_photo/<int:user_id>", profile_photo, name="profile_photo"),
    path("edit_student/<int:user_id>", edit_student, name="edit_student"),
    path("delete_student/<int:user_id>", delete_student, name="delete_student"),
    path("cancel_request/<int:user_id>", cancel_request, name="cancel_request"),
    path("approve_request/<int:user_id>",
         approve_request, name="approve_request"),
    path("create_schedule/", create_schedule, name="create_schedule"),
    path("create_note/<int:user_id>", create_note, name="create_note"),
    path("delete_note/<int:note_id>", delete_note, name="delete_note"),
    path(
        "note_info/<int:note_id>", note_info, name="note_info"
    ),
    path(
        "edit_note/<int:note_id>", edit_note, name="edit_note"
    ),
    path(
        "change_student_teacher/<int:user_id>",
        change_student_teacher,
        name="change_student_teacher",
    ),
    # USER AUTHENTICATION PATHS
    path("available/", available, name="available"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path(
        "change-password/",
        auth_views.PasswordChangeView.as_view(
            template_name="password_reset_form.html",
            success_url=reverse_lazy("users:change-password-done"),
        ),
        name="change-password",
    ),
    path(
        "change-password-done/",
        auth_views.PasswordChangeDoneView.as_view(
            template_name="password_reset_done.html"
        ),
        name="change-password-done",
    ),
    path("default_password/<int:user_id>",
         default_password, name="default_password"),
    # LEVEL PATHS
    path("load_level_students/", load_level_students, name="load_level_students"),
    path("load_notes/", load_notes, name="load_notes"),
    path("search_level_students/", search_level_students,
         name="search_level_students"),
    path("get_this_percentage/", get_this_percentage, name="get_this_percentage"),
    path(
        "change_delivered/<int:levelID>/<int:studentID>",
        change_delivered,
        name="change_delivered",
    ),
    # TEACHER PATHS
    path("signature/<int:user_id>", signature, name="signature"),

    # CHECKER PATHS
    path("active_without_level/",
         active_without_level, name="active_without_level"),
    path("hundred_no_certificate/",
         hundred_no_certificate, name="hundred_no_certificate"),
    path("no_hundred_certificate/",
         no_hundred_certificate, name="no_hundred_certificate"),
    path("hundred_no_delivered/",
         hundred_no_delivered, name="hundred_no_delivered"),

]
