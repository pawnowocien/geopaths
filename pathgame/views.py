from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt

import json

from .models import Board, User


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

    return redirect('pathgame:board_creator')  # fallback for non-POST requests



@login_required
def edit_board(request, pk):
    board = get_object_or_404(Board, pk=pk, creator=request.user)
    poly_points = []
    for y in range(board.height + 1):
        for x in range(board.width + 1):
            poly_points.append((100 * x / board.width, 100 * y / board.height))
    context = {
        "board": board,
        "poly_points": poly_points,
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