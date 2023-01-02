from django.urls import path
from .views import *

app_name = "courses"

urlpatterns = [
    path("addCourses/", addCourses, name="addCourses"),
    path("editCourses/", editCourses, name="editCourses"),
    path("attendances/", attendances, name="attendances"),
    path("change/", change, name="change"),
    path("courses/", courses, name="courses"),
    path("course/", course, name="course"),
    path("editCourse/", editCourse, name="editCourse"),
    path("deleteCourse/", deleteCourse, name="deleteCourse"),
    path("printCourse/", printCourse, name="printCourse"),

    # LEVELS
    path("category/", category, name="category"),
    path("level/", level, name="level"),
    path("levelsInfo/", levelsInfo, name="levelsInfo"),
    path("tasks/", tasks, name="tasks"),
    path("deleteLevel/", deleteLevel, name="deleteLevel"),
    path("studentLevel/", studentLevel, name="studentLevel"),

    # CERTIFICATE
    path("certificate/", certificate, name="certificate"),


    # TASKS
    path("task/", task, name="task"),
    path("deleteTask/", deleteTask, name="deleteTask"),

    # PRICE
    path("price/", price, name="price"),

    # SCHEDULES
    path("schedules/", schedules, name="schedules"),
    path("schedulesInfo/", schedulesInfo, name="schedulesInfo"),
]
