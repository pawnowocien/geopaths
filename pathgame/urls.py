from django.urls import path
from . import views


app_name = "pathgame"

urlpatterns = [
    path("", views.index, name="index"),
    path("user_page/<int:user_id>", views.user_page, name="user_page"),
    path("board_creator", views.board_creator, name="board_creator"),
    # path("list", views.list, name="list"),
    # path("<int:cavemap_id>/", views.detail, name="detail"),
    # path("path/<int:path_id>/", views.path, name="path"),

    # path('user_paths/<int:user_id>', views.user_paths, name="user_paths"),

    # path('pathpoint/<int:point_id>/delete/', views.delete_pathpoint, name='delete_pathpoint'),
    # path('pathpoint/<int:point_id>/move/<str:direction>/', views.move_pathpoint, name='move_pathpoint'),

    path('login/', views.custom_login, name='login'),
    path('logout/', views.custom_logout, name='logout'),
]