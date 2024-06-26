"""aquarium URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

# from django.contrib import admin
# from django.contrib.auth import views as auth_views


urlpatterns = [
    # path('admin/', admin.site.urls),
    path("api/users/", include("users.urls")),
    path("api/courses/", include("courses.urls")),
    path("api/levels/", include("levels.urls")),
    path(
        "api/login/password_reset/",
        include("django_rest_passwordreset.urls", namespace="password_reset"),
    )
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)

urlpatterns += [re_path(".*",
                        TemplateView.as_view(template_name="index.html"))]

# from django.contrib import admin
# from django.urls import path, include
# from django.conf import settings
# from django.views.static import serve
# from django.conf.urls.static import static
# from django.views.generic import TemplateView
# from django.contrib.auth import views as auth_views

# urlpatterns = [
#     path('', TemplateView.as_view(
#         template_name="main.html"), name='main'),

#     path('accounts/login/', TemplateView.as_view(
#         template_name="main.html"), name='main'),

#     path('admin/', admin.site.urls),
#     path('users/', include("users.urls")),
#     path('courses/', include("courses.urls")),

#     # USER AUTHENTICATION
#     path('reset_password/', auth_views.PasswordResetView.as_view(
#         template_name="reset_password.html"), name='reset_password'),
#     path('reset_password_sent/', auth_views.PasswordResetDoneView.as_view(
#         template_name="password_reset_sent.html"), name='password_reset_done'),
#     path('reset/<uidb64>/<token>', auth_views.PasswordResetConfirmView.as_view(
#         template_name="password_reset_form.html"), name='password_reset_confirm'),
#     path('reset_password_complete/', auth_views.PasswordResetCompleteView.as_view(
#         template_name="password_reset_done.html"), name='password_reset_complete'),

# ]
