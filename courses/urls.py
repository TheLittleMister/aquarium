from django.urls import path
from django.conf.urls import url
from django import views as django_views
from .views import *

app_name = "courses"

urlpatterns = [
    url(r'^jsi18n/$', django_views.i18n.JavaScriptCatalog.as_view(), name='jsi18n'),
    path("", index, name="index"), # "" == courses/
    path("student/<int:account_id>", student, name="student"),
    path("student/history/<int:account_id>", student_history, name="history"),
    path("student/create/", create_student, name="create_student"),
    path("+1", plus_one, name="plus_one"),

    path("student/delete/<int:account_id>", delete_student, name="delete_student"),
    path("course/<int:course_id>", course, name="course"),
    path("course/create/", create_course, name="create_course"),
    path("course/print/<int:course_id>", print_course, name="print_course"),
    path("course/print/search/<int:course_id>", print_search, name="print_search"),
    path("course/print/today", print_courses, name="print_courses"),
    path("course/delete/<int:course_id>", delete_course, name="delete_course"),
    path("course/attendance/<int:course_id>", attendance_course, name="attendance_course"),
    path("attendance/<int:attendance_id>", attendance, name="attendance"), # FETCH
    path("pay/<int:attendance_id>", pay, name="pay"), # FETCH

    path("notifications/", notifications, name="notifications"), #FETCH
    path("getnotifications/", getnotifications, name="getnotifications"),
    path("ignore/<int:account_id>", ignore, name="ignore"),

    path("course/payment/<int:attendance_id>", payment, name="payment"),
    path("courses", courses, name="courses"),
    path("courses/all/past", past_courses, name="past_courses"),
    path("courses/all/next", next_courses, name="next_courses"),
    path("courses/past/<int:account_id>", past_student_courses, name="past_student_courses"),
    path("courses/next/<int:account_id>", next_student_courses, name="next_student_courses"),
    path("assign", assign, name="assign"),
    path("quota/<int:student_id>", quota, name="quota"),

    path("login", login_view, name="login"),
    path("logout", logout_view, name="logout"),

    path("update_first_name/<int:account_id>", update_first_name, name="update_first_name"),
    path("reject_first_name/<int:account_id>", reject_first_name, name="reject_first_name"),

    path("update_last_name/<int:account_id>", update_last_name, name="update_last_name"),
    path("reject_last_name/<int:account_id>", reject_last_name, name="reject_last_name"),

    path("update_id/<int:account_id>", update_id, name="update_id"),
    path("reject_id/<int:account_id>", reject_id, name="reject_id"),

    path("update_phone_1/<int:account_id>", update_phone_1, name="update_phone_1"),
    path("reject_phone_1/<int:account_id>", reject_phone_1, name="reject_phone_1"),

    path("update_phone_2/<int:account_id>", update_phone_2, name="update_phone_2"),
    path("reject_phone_2/<int:account_id>", reject_phone_2, name="reject_phone_2"),

    path("inconsistency/", inconsistency, name="inconsistency")

] 