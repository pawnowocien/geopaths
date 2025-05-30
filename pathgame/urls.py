from django.urls import path
from . import views


app_name = "pathgame"

urlpatterns = [
    path("", views.index, name="index"),
    
    path("user_page/<int:user_id>/", views.user_page, name="user_page"),
    
    path("board/creator/", views.board_creator, name="board_creator"),
    path("board/edit/<int:pk>/", views.board_edit, name="board_edit"),
    path("board/preview/<int:pk>/", views.board_preview, name="board_preview"),
    path("board/list/", views.board_list, name="board_list"),
    path("board/delete/<int:pk>/", views.board_delete, name="board_delete"),
    path("board/save/", views.board_save, name="board_save"),
    path("board/update_cell/", views.update_board_cell, name="update_board_cell"),
    
    path("subboard/editor/<int:pk>/", views.subboard_editor, name="subboard_editor"),
    path("subboard/update_name/<int:pk>/", views.update_subboard_name, name="update_subboard_name"),
    path("subboard/create/", views.subboard_create, name="subboard_create"),
    path("subboard/delete/<int:pk>/", views.subboard_delete, name="subboard_delete"),
    path("subboard/path/create/", views.create_path, name="create_path"),
    path("subboard/path/delete/", views.delete_path, name="delete_path"),
    
    path("sse/notifications/", views.sse_notifications, name="sse_notifications"),
    
    path('login/', views.custom_login, name='login'),
    path('logout/', views.custom_logout, name='logout'),
]