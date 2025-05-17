from django.contrib import admin
from .models import Board, SubBoard, BoardPoint, Path, PathPoint


admin.site.register(Board)
admin.site.register(SubBoard)
admin.site.register(BoardPoint)
admin.site.register(Path)
admin.site.register(PathPoint)