from django.urls import path
from . import views


app_name = "pathgame"

urlpatterns = [
    path("", views.index, name="index"),
    path("user_page/<int:user_id>", views.user_page, name="user_page"),
    path("board_creator", views.board_creator, name="board_creator"),
    path("board_edit/<int:pk>", views.board_edit, name="board_edit"),
    path("board_preview/<int:pk>", views.board_preview, name="board_preview"),
    path("board_list", views.board_list, name="board_list"),
    path("board_delete/<int:pk>", views.board_delete, name="board_delete"),
    
    path("subboard_editor/<int:pk>", views.subboard_editor, name="subboard_editor"),
    path("update_subboard_name/<int:pk>", views.update_subboard_name, name="update_subboard_name"),
    path("create_path", views.create_path, name="create_path"),
    path("delete_path", views.delete_path, name="delete_path"),
    
    path("board_save", views.board_save, name="board_save"),
    path("subboard_create", views.subboard_create, name="subboard_create"),
    path("update_board_cell", views.update_board_cell, name="update_board_cell"),
    path("subboard_delete/<int:pk>", views.subboard_delete, name="subboard_delete"),

    path('login/', views.custom_login, name='login'),
    path('logout/', views.custom_logout, name='logout'),
]