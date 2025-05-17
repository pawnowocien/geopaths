from django.db import models
from django.contrib.auth.models import User

class Board(models.Model):
    name = models.CharField(max_length=50)
    width = models.PositiveIntegerField()
    height = models.PositiveIntegerField()
    
    type = models.PositiveSmallIntegerField(choices=[
        (3, 'Triangle'),
        (4, 'Square'),
        (6, 'Hexagon'),
    ])
    
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='boards')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class SubBoard(models.Model):
    name = models.CharField(max_length=50)
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='subboards')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subboards')

    def __str__(self):
        return f"SubBoard {self.id} of {self.board.owner}"

class BoardPoint(models.Model):
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='points')
    row = models.PositiveIntegerField()
    col = models.PositiveIntegerField()
    color = models.CharField(max_length=7, default="#FFFFFF")  # Hex color code
    
    class Meta:
        unique_together = ('board', 'row', 'col')

    def __str__(self):
        return f"Point ({self.row}, {self.col})"


class Path(models.Model):
    board = models.ForeignKey(SubBoard, on_delete=models.CASCADE)
    color = models.CharField(max_length=7, default="#000000")  # Hex color code

    def __str__(self):
        return f"Path {self.id} from Board {self.board.id}"


class PathPoint(models.Model):
    path = models.ForeignKey(Path, on_delete=models.CASCADE, related_name='points')
    x = models.PositiveIntegerField()
    y = models.PositiveIntegerField()
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']
        unique_together = ('path', 'order')

    def __str__(self):
        return f"Point {self.order}. ({self.x}, {self.y})"