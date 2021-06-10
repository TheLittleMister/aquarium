from django.urls import path
from .views import *

from django.urls import reverse_lazy
from django.contrib.auth import views as auth_views

app_name = "users"

urlpatterns = [

    # USER PATHS
    path('profile/<int:user_id>', profile, name="profile"),
    path('profile_photo/<int:user_id>', profile_photo, name="profile_photo"),
    path('edit_student/<int:user_id>', edit_student, name="edit_student"),
    path('edit_profile/<int:user_id>', edit_profile, name="edit_profile"),
    path('delete_student/<int:user_id>', delete_student, name="delete_student"),
    path('cancel_request/<int:user_id>', cancel_request, name="cancel_request"),
    path('approve_request/<int:user_id>',
         approve_request, name="approve_request"),

    path('create_schedule/', create_schedule, name="create_schedule"),
    path('redirection/', redirection, name="redirection"),

    path('change_student_color/<int:user_id>',
         change_student_color, name="change_student_color"),

    # USER AUTHENTICATION PATHS
    path('available/', available, name="available"),
    path('login/', login_view, name="login"),
    path('logout/', logout_view, name="logout"),
    path('change-password/', auth_views.PasswordChangeView.as_view(template_name='password_reset_form.html',
         success_url=reverse_lazy('users:change-password-done')), name="change-password"),
    path('change-password-done/', auth_views.PasswordChangeDoneView.as_view(
        template_name='password_reset_done.html'), name="change-password-done"),

    path('default_password/<int:user_id>',
         default_password, name="default_password"),

    # LEVEL PATHS
    path('load_level_students/', load_level_students, name="load_level_students"),
    path("search_level_students/", search_level_students,
         name="search_level_students"),

    # TEACHER PATHS
    path('signature/<int:user_id>', signature, name="signature"),

]
