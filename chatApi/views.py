from channels.auth import login
from django.contrib.auth import authenticate
from django.shortcuts import render, redirect


from rest_framework.viewsets import ModelViewSet

from chatApi.forms import SignUpForm
from chatApi.models import Room, Profile
from chatApi.serializers import RoomSerializer, ProfileSerializer


# def signup(request):
#     if request.method == 'POST':
#         form = SignUpForm(request.POST)
#
#         if form.is_valid():
#             user = form.save()
#
#             # Аутентификация пользователя и логин
#             username = form.cleaned_data.get('username')
#             password = form.cleaned_data.get('password1')
#             user = authenticate(request, username=username, password=password)
#             login(request, user)
#
#             # Ассоциирование профиля с пользователем
#             if not Profile.objects.filter(user=user).exists():
#                 profile = Profile(user=user)
#                 profile.save()
#
#             return redirect('frontpage')
#         else:
#             # Вывод ошибок на страницу
#             error_message = str(form.errors)
#             return render(request, 'accounts/signup.html', {'form': form, 'error_message': error_message})
#
#     else:
#         form = SignUpForm()
#     return render(request, 'accounts/signup.html', {'form': form})

class ApiRoomsViewSet(ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class ApiProfileViewSet(ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
