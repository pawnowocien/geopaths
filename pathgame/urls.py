from django.urls import path
from . import views


app_name = "pathgame"

urlpatterns = [
    path("", views.index, name="index"),
    path("user_page/<int:user_id>", views.user_page, name="user_page"),
    path("board_creator", views.board_creator, name="board_creator"),
    path("board_save", views.board_save, name="board_save"),
    path("board_edit/<int:pk>", views.edit_board, name="board_edit"),

    path('login/', views.custom_login, name='login'),
    path('logout/', views.custom_logout, name='logout'),
]