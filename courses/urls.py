from django.urls import path
from django.conf.urls import url
from django import views as django_views
from .views import *

app_name = "courses"

urlpatterns = [
    url(r"^jsi18n/$", django_views.i18n.JavaScriptCatalog.as_view(), name="jsi18n"),
    # Students Paths
    path("", students, name="students"),
    path("load_students/", load_students, name="load_students"),
    path("load_active_students/", load_active_students,
         name="load_active_students"),
    path(
        "search_active_students/", search_active_students, name="search_active_students"
    ),
    path("search_students/", search_students, name="search_students"),
    path("create_student/", create_student, name="create_student"),
    path("student/<int:student_id>", student, name="student"),
    path("create_schedule/", create_schedule, name="create_schedule"),
    path("student_statistics/", student_statistics, name="student_statistics"),
    path("inconsistencies/", inconsistencies, name="inconsistencies"),
    path(
        "change_exception/<int:student_id>", change_exception, name="change_exception"
    ),
    path("plus/", plus, name="plus"),
    path("change/", change, name="change"),
    path("teachers/", teachers, name="teachers"),
    path("levels/<int:student_id>", levels, name="levels"),
    path("level_info/<int:student_level_id>", level_info, name="level_info"),
    path("edit_level/<int:student_level_id>/<str:modal>",
         edit_level, name="edit_level"),
    path(
        "deactivate_level/<int:student_level_id>",
        deactivate_level,
        name="deactivate_level",
    ),
    path("user_data/", user_data, name="user_data"),
    # Attendances Paths
    path(
        "load_future_attendances/",
        load_future_attendances,
        name="load_future_attendances",
    ),
    path("load_past_attendances/", load_past_attendances,
         name="load_past_attendances"),
    path("course_info/<int:course_id>", course_info, name="course_info"),
    path(
        "change_attendance/<int:attendance_id>",
        change_attendance,
        name="change_attendance",
    ),
    path("change_quota/<int:attendance_id>",
         change_quota, name="change_quota"),
    path(
        "attendance_info/<int:attendance_id>", attendance_info, name="attendance_info"
    ),
    path("change_cycle/<int:attendance_id>",
         change_cycle, name="change_cycle"),
    path("change_day/<int:attendance_id>", change_day, name="change_day"),
    path(
        "edit_attendance/<int:attendance_id>", edit_attendance, name="edit_attendance"
    ),
    path("search_attendance/", search_attendance, name="search_attendance"),
    path("date_attendances/", date_attendances, name="date_attendances"),
    # Courses Paths
    path("edit_courses/<int:user_id>", edit_courses, name="edit_courses"),
    path("courses/", courses, name="courses"),
    path("load_past_courses/", load_past_courses, name="load_past_courses"),
    path("load_future_courses/", load_future_courses, name="load_future_courses"),
    path("search_course/", search_course, name="search_course"),
    path("create_courses/", create_courses, name="create_courses"),
    path("course/<int:course_id>", course, name="course"),
    path("edit_course/<int:course_id>", edit_course, name="edit_course"),
    path("delete_course/<int:course_id>", delete_course, name="delete_course"),
    path("print_courses/", print_courses, name="print_courses"),
    path("print_course/<int:course_id>", print_course, name="print_course"),
    # Certificate Paths
    path(
        "generate_certificate/<int:student_level_id>",
        generate_certificate,
        name="generate_certificate",
    ),
    path(
        "delete_certificate/<int:student_level_id>",
        delete_certificate,
        name="delete_certificate",
    ),
]
