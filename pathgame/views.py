from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.core.exceptions import PermissionDenied
from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt

import json

from .models import Board, User, BoardPoint


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

            # Basic validation
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
        row = int(data.get('row'))
        col = int(data.get('col'))
        board_id = int(data.get('board'))
        color = str(data.get('color'))

        if row is None or col is None or board_id is None or color is None:
            return JsonResponse({'error': 'Missing data'}, status=400)
        

        
        board = Board.objects.get(pk=board_id, creator=request.user)

        if BoardPoint.objects.filter(board=board, row=row, col=col).exists():
            if color == "":
                BoardPoint.objects.filter(board=board, row=row, col=col).delete()
            else:
                BoardPoint.objects.filter(board=board, row=row, col=col).update(color=color)
        else:
            if color != "":
                BoardPoint.objects.create(board=board, row=row, col=col, color=color)

        return JsonResponse({'status': 'success'})

    except Board.DoesNotExist:
        return JsonResponse({'error': 'Board not found or permission denied'}, status=403)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@login_required
def edit_board(request, pk):
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
    colors = list(colors)
    # colors.remove("")
    colors.append("#FF0000")
    colors.append("#00FF00")
    colors.append("#0000FF")
    colors.append("#FF00FF")
    colors.append("#FFFF00")
    colors.append("#00FFFF")
    context = {
        "board": model_to_dict(board),
        "poly_points": poly_points,
        "board_points": board_points,
        "colors": colors,
    }
    return render(request, 'pathgame/board_edit.html', context)



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