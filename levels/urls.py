from django.urls import path
from .views import *

app_name = "levels"

urlpatterns = [
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
]
