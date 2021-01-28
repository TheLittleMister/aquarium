from django.urls import path
from django.conf.urls import url
from django import views as django_views
from . import views

app_name = "courses"

urlpatterns = [
    url(r'^jsi18n/$', django_views.i18n.JavaScriptCatalog.as_view(), name='jsi18n'),
    path("", views.index, name="index"), # "" == courses/
    path("student/<int:account_id>", views.student, name="student"),
    path("student/history/<int:account_id>", views.student_history, name="history"),
    path("student/create/", views.create_student, name="create_student"),
    path("student/delete/<int:account_id>", views.delete_student, name="delete_student"),
    path("course/<int:course_id>", views.course, name="course"),
    path("course/create/", views.create_course, name="create_course"),
    path("course/print/<int:course_id>", views.print_course, name="print_course"),
    path("course/print/search/<int:course_id>", views.print_search, name="print_search"),
    path("course/print/today", views.print_courses, name="print_courses"),
    path("course/delete/<int:course_id>", views.delete_course, name="delete_course"),
    path("course/attendance/<int:course_id>", views.attendance_course, name="attendance_course"),
    path("attendance/<int:attendance_id>", views.attendance, name="attendance"), # FETCH
    path("notifications/", views.notifications, name="notifications"), #FETCH
    path("getnotifications/", views.getnotifications, name="getnotifications"),
    path("course/payment/<int:attendance_id>", views.payment, name="payment"),
    path("courses", views.courses, name="courses"),
    path("courses/all/past", views.past_courses, name="past_courses"),
    path("courses/all/next", views.next_courses, name="next_courses"),
    path("courses/past/<int:account_id>", views.past_student_courses, name="past_student_courses"),
    path("courses/next/<int:account_id>", views.next_student_courses, name="next_student_courses"),
    path("assign", views.assign, name="assign"),
    path("quota/<int:student_id>", views.quota, name="quota"),

    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),

    path("update_first_name/<int:account_id>", views.update_first_name, name="update_first_name"),
    path("reject_first_name/<int:account_id>", views.reject_first_name, name="reject_first_name"),

    path("update_last_name/<int:account_id>", views.update_last_name, name="update_last_name"),
    path("reject_last_name/<int:account_id>", views.reject_last_name, name="reject_last_name"),

    path("update_id/<int:account_id>", views.update_id, name="update_id"),
    path("reject_id/<int:account_id>", views.reject_id, name="reject_id"),

    path("update_phone_1/<int:account_id>", views.update_phone_1, name="update_phone_1"),
    path("reject_phone_1/<int:account_id>", views.reject_phone_1, name="reject_phone_1"),

    path("update_phone_2/<int:account_id>", views.update_phone_2, name="update_phone_2"),
    path("reject_phone_2/<int:account_id>", views.reject_phone_2, name="reject_phone_2"),

] 