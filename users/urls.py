from django.urls import path
from . import views

from django.urls import reverse_lazy
from django.contrib.auth import views as auth_views

app_name = "users"

urlpatterns = [
    path("<int:account_id>", views.index, name="index"),
    path("courses/<int:account_id>", views.courses, name="courses"),

    path('change-password/', auth_views.PasswordChangeView.as_view(template_name='change-password.html',
         success_url=reverse_lazy('users:change-password-done')), name="change-password"),
    path('change-password-done/', auth_views.PasswordChangeDoneView.as_view(
        template_name='change-password-done.html'), name="change-password-done"),
]
