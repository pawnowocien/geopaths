from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Board, SubBoard, Path

import queue
import threading

event_queue = queue.Queue()

clients = set()
clients_lock = threading.Lock()

def publish_event(event: str, data: dict):
    import json
    event_str = f"event: {event}\ndata: {json.dumps(data)}\n\n"
    with clients_lock:
        for client_queue in clients:
            client_queue.put(event_str)
    


@receiver(post_save, sender=Board)
def board_created(sender, instance, created, **kwargs):
    if created:
        publish_event("newBoard", {
            "board_id": instance.id,
            "board_name": instance.name,
            "creator_username": instance.creator.username,
            "creator_is_admin": instance.creator.is_superuser,
            "creator_id": instance.creator.id,
        })
        
@receiver(post_save, sender=SubBoard)
def subboard_created(sender, instance, created, **kwargs):
    if created:
        publish_event("newSubBoard", {
            "subboard_id": instance.id,
            "subboard_name": instance.name,
            "subboard_creator": instance.owner.username,
            "subboard_creator_is_admin": instance.owner.is_superuser,
            "subboard_creator_id": instance.owner.id,
            "board_id": instance.board.id,
            "board_name": instance.board.name,
            "board_creator": instance.board.creator.username,
            "board_creator_is_admin": instance.board.creator.is_superuser,
        })

@receiver(post_save, sender=Path)
def path_created(sender, instance, created, **kwargs):
    if created:
        publish_event("newPath", {
            "path_id": instance.id,
            "subboard_id": instance.board.id,
            "subboard_name": instance.board.name,
            "subboard_creator": instance.board.owner.username,
            "subboard_creator_is_admin": instance.board.owner.is_superuser,
            "subboard_creator_id": instance.board.owner.id,
            "color": instance.color,
            "board_id": instance.board.board.id,
            "board_name": instance.board.board.name,
            "board_creator": instance.board.board.creator.username,
            "board_creator_is_admin": instance.board.board.creator.is_superuser,
        })