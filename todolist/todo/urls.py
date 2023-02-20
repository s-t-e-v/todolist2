from django.urls import path


from . import views

urlpatterns = [
    path('',views.index,name="index"),
    path('add/', views.add, name="add"),
    path('delete/', views.delete, name="delete"),
    path('checkstateup/', views.checkstate_update, name="checkstateup"),
    path('tasknameup/', views.taskname_update, name="tasknameup"),

]
