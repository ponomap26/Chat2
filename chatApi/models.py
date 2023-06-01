from django.contrib.auth.models import User
from django.db import models


class Room(models.Model):
    name = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Комната чата"
        verbose_name_plural = "Комнаты чатов"


class Message(models.Model):
    room = models.ForeignKey(Room, related_name='messages', on_delete=models.CASCADE, verbose_name="Название чата")
    user = models.ForeignKey(User, related_name='messages', on_delete=models.CASCADE, verbose_name="Пользователь")
    content = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('date_added',)


class Profile(models.Model):
    nic = models.CharField(max_length=56, verbose_name='Никнейм', null=True, blank=True)
    avatar = models.ImageField(upload_to='chatImage', null=True, blank=True, verbose_name='Аватарка')
    online = models.BooleanField(default=False)

    def user_list(self):
        users = Profile.objects.filter().order_by('name')
        return list(users)