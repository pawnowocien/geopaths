from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.core.exceptions import PermissionDenied
from django.forms.models import model_to_dict
from django.http import JsonResponse, StreamingHttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt

import time
import json
import pathgame.utils as utils

from .models import Board, User, BoardPoint, SubBoard, Path, PathPoint


def index(request):
    return render(request, "pathgame/index.html")


@login_required
def user_page(request, user_id):
    user = get_object_or_404(User, pk=user_id)

    if request.user != user and not request.user.is_staff:
        raise PermissionDenied
    
    user_boards = user.boards.all()
    user_subboards = user.subboards.all()
    
    context = {
        "boards": user_boards,
        "subboards": user_subboards,
        "prev_page": 'pathgame:index',
        "prev_page_label": 'Go to the Maps List',
    }
    return render(request, "pathgame/user_page.html", context)

@login_required
def board_creator(request):
    return render(request, "pathgame/board_creator.html")


@login_required
def board_save(request):
    if request.method == 'POST':
        try:
            name = request.POST.get('name', 'Untitled').strip()
            width = int(request.POST.get('width', 10))
            height = int(request.POST.get('height', 10))
            shape = int(request.POST.get('type', 'square'))

            if not (2 <= width <= 30 and 2 <= height <= 30):
                messages.error(request, "Width and height must be between 2 and 30.")
                return redirect('pathgame:board_creator')

            if shape not in (3, 4, 6):
                messages.error(request, "Invalid shape type selected.")
                return redirect('pathgame:board_creator')

            board = Board.objects.create(
                name=name or "Untitled",
                width=width,
                height=height,
                type=shape,
                creator=request.user
            )
            messages.success(request, "Board created successfully!")
            return redirect('pathgame:board_edit', pk=board.pk)

        except (ValueError, TypeError):
            messages.error(request, "Invalid form submission.")
            return redirect('pathgame:board_creator')

    return redirect('pathgame:board_creator')


@csrf_exempt
@login_required
def update_board_cell(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid method'}, status=405)

    try:
        data = json.loads(request.body)
        board_id = int(data.get('board'))
        color_map = data.get('color_map')

        colors = {}
        for row_index, row in enumerate(color_map):
            for col_index, value in enumerate(row):
                if value not in colors.keys():
                    colors[value] = []
                colors[value].append((row_index, col_index))
        
        for col in colors.keys():
            if len(colors[col]) != 2 and col != "":
                error_msg = "For each color there should be 0 or 2 points."
                return JsonResponse({'status': 'failure', 'message': error_msg})
                
        
        board = Board.objects.get(pk=board_id, creator=request.user)
        board.subboards.all().delete()

        for color in colors.keys():
            for row, col in colors[color]:
                if color == "":
                    BoardPoint.objects.filter(board=board, row=row, col=col).delete()
                else:
                    BoardPoint.objects.update_or_create(board=board, row=row, col=col, color=color)

        return JsonResponse({'status': 'success'})

    except Board.DoesNotExist:
        return JsonResponse({'error': 'Board not found or permission denied'}, status=403)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@login_required
def board_edit(request, pk):
    board = get_object_or_404(Board, pk=pk, creator=request.user)
    poly_points = []
    for y in range(board.height + 1):
        for x in range(board.width + 1):
            poly_points.append((100 * x / board.width, 100 * y / board.height))
            
    board_points_list = board.points.all()
    board_points = [model_to_dict(point) for point in board_points_list]

    colors = set()
    for point in board_points:
        colors.add(point['color'])

    colors.update(["#FF0000", "#00FF00", "#0000FF", "#FF00FF", "#FFFF00", "#00FFFF"])
    colors = sorted(colors, key=lambda c: utils.hex_to_hsl(c)[0])
    
    context = {
        "board": model_to_dict(board),
        "poly_points": poly_points,
        "board_points": board_points,
        "colors": colors,
        "author": board.creator,
    }
    return render(request, 'pathgame/board_edit.html', context)

@login_required
def board_delete(request, pk):
    board = get_object_or_404(Board, pk=pk, creator=request.user)
    if request.method == 'POST':
        board.delete()
        return redirect('pathgame:user_page', user_id=request.user.id)
    return redirect('pathgame:user_page', user_id=request.user.id)



def board_list(request):
    boards = Board.objects.all()
    context = {
        'boards': boards
    }
    return render(request, 'pathgame/board_list.html', context)



def board_preview(request, pk):
    board = get_object_or_404(Board, pk=pk)
    poly_points = []
    for y in range(board.height + 1):
        for x in range(board.width + 1):
            poly_points.append((100 * x / board.width, 100 * y / board.height))
            
    board_points_list = board.points.all()
    board_points = [model_to_dict(point) for point in board_points_list]

    colors = set()
    for point in board_points:
        colors.add(point['color'])
    colors = list(colors)
    context = {
        "board": model_to_dict(board),
        "poly_points": poly_points,
        "board_points": board_points,
        "colors": colors,
        "author": board.creator,
        "user_is_author": board.creator == request.user
    }
    return render(request, 'pathgame/board_preview.html', context)


@csrf_exempt
@login_required
def subboard_create(request):
    if request.method == 'POST':
        try:
            board_id = request.POST.get('board_id')
            subboard = SubBoard.objects.create(
                name="Untitled",
                board=Board.objects.get(pk=board_id),
                owner=request.user
            )
            
            messages.success(request, "SubBoard created successfully!")
            return redirect('pathgame:subboard_editor', pk=subboard.pk)

        except (ValueError, TypeError):
            messages.error(request, "Invalid form submission.")
            return redirect('pathgame:board_list')

    return redirect('pathgame:board_list')

@login_required
def subboard_delete(request, pk):
    subboard = get_object_or_404(SubBoard, pk=pk, owner=request.user)
    if request.method == 'POST':
        subboard.delete()
        return redirect('pathgame:user_page', user_id=request.user.id)
    return redirect('pathgame:user_page', user_id=request.user.id)




@login_required
def subboard_editor(request, pk):
    subboard = get_object_or_404(SubBoard, pk=pk, owner=request.user)
    
    board = subboard.board
    
    poly_points = []
    for y in range(board.height + 1):
        for x in range(board.width + 1):
            poly_points.append((100 * x / board.width, 100 * y / board.height))
            
    board_points_list = board.points.all()
    board_points = [model_to_dict(point) for point in board_points_list]

    colors = set()
    for point in board_points:
        colors.add(point['color'])
    colors = list(colors)
    
    paths = []
    for path_obj in subboard.paths.all():
        path = {
            'color': path_obj.color,
            'points': []
        }
        for point in path_obj.points.order_by('order'):
            path['points'].append((point.row, point.col))
        paths.append(path)
    
    context = {
        'subboard': model_to_dict(subboard),
        'board': model_to_dict(subboard.board),
        "poly_points": poly_points,
        "board_points": board_points,
        "colors": colors,
        "paths": paths,
        "board_author": board.creator,
        "subboard_author": subboard.owner
    }
    return render(request, 'pathgame/subboard_editor.html', context)




@login_required
def update_subboard_name(request, pk):
    subboard = get_object_or_404(SubBoard, id=pk, owner=request.user)
    if request.method == 'POST':
        new_name = request.POST.get('name', '').strip()
        if new_name:
            subboard.name = new_name
            subboard.save()
    return redirect('pathgame:subboard_editor', pk=subboard.pk)



@csrf_exempt
@login_required
def create_path(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid method'}, status=405)

    try:
        data = json.loads(request.body)
        path_got = data.get('path')
        subboard_id = int(data.get('subboard'))
        subboard = get_object_or_404(SubBoard, id=subboard_id, owner=request.user)
        
        board_id = subboard.board.pk
        board_point = BoardPoint.objects.filter(board=board_id, row=int(path_got[0]['row']), col=int(path_got[0]['col'])).first()
        color = board_point.color
        
        path_obj = Path.objects.create(
            board = subboard,
            color = color,
        )
        for id, point in enumerate(path_got):
            row, col = int(point['row']), int(point['col'])
            PathPoint.objects.create(
                path = path_obj,
                row = row,
                col = col,
                order = id + 1,
            )
            
        return JsonResponse({'status': 'success'})

    except Board.DoesNotExist:
        return JsonResponse({'error': 'Board not found or permission denied'}, status=403)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@login_required
def delete_path(request):
    if request.method != 'DELETE':
        return JsonResponse({'error': 'Invalid method'}, status=405)

    try:
        data = json.loads(request.body)
        start = data.get('start')
        subboard_id = data.get('subboard')
        
        
        start_point = PathPoint.objects.get(path__board=subboard_id, row=start[0], col=start[1])
        
        path = start_point.path
        
        path.delete()
        return JsonResponse({'status': 'success'})

    except Board.DoesNotExist:
        return JsonResponse({'error': 'Board not found or permission denied'}, status=403)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)











def custom_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)

            next_url = request.GET.get('next', 'pathgame:index')
            return redirect(next_url)

        else:
            messages.error(request, 'Invalid username or password.')
    else:
        form = AuthenticationForm()

    return render(request, 'pathgame/login.html', {'form': form})


def custom_logout(request):
    logout(request)
    messages.success(request, "You have successfully logged out.")
    return redirect('pathgame:index')



import queue
import time
from django.http import StreamingHttpResponse
from pathgame.sse_manager import clients, clients_lock

def sse_notifications(request):
    client_queue = queue.Queue()
    with clients_lock:
        clients.add(client_queue)

    def event_stream():
        try:
            while True:
                try:
                    event = client_queue.get(timeout=10)
                    yield event
                except queue.Empty:
                    yield ": keep-alive\n\n"
        finally:
            with clients_lock:
                clients.discard(client_queue)

    return StreamingHttpResponse(event_stream(), content_type='text/event-stream')