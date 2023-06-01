from django.urls import re_path
from .consumers import WSConsumer, WSChat


ws_urlpatterns = [
    re_path(r'ws/apps/', WSConsumer.as_asgi()),
    re_path(r'ws/chat/', WSChat.as_asgi()),
]

channel_routing = {
    'websocket.connect': 'chatApi.consumers.WSConsumer.as_asgi()',
    'websocket.receive': 'chatApi.consumers.WSConsumer.as_asgi()',
    'websocket.disconnect': 'chatApi.consumers.WSConsumer.as_asgi()',
}