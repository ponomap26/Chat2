from channels.auth import login
from django.contrib.auth import authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.shortcuts import render, redirect


from rest_framework.viewsets import ModelViewSet

from chatApi.forms import SignUpForm, UserEditForm, ProfileEditForm
from chatApi.models import Room, Profile
from chatApi.serializers import RoomSerializer, ProfileSerializer


def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)

        if form.is_valid():
            user = form.save()

            # Аутентификация пользователя и логин
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            user = authenticate(request, username=username, password=password)
            login(request, user)

            # Ассоциирование профиля с пользователем
            if not Profile.objects.filter(user=user).exists():
                profile = Profile(user=user)
                profile.save()

            return redirect('frontpage')
        else:
            # Вывод ошибок на страницу
            error_message = str(form.errors)
            return render(request, 'accounts/signup.html', {'form': form, 'error_message': error_message})

    else:
        form = SignUpForm()
    return render(request, 'accounts/signup.html', {'form': form})

class ApiRoomsViewSet(ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class ApiProfileViewSet(ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@login_required
def edit(request):
    try:
        profile = request.user.Profile.objects
    except Profile.DoesNotExist:
        profile = Profile(user=request.user)

    user_form = UserEditForm(instance=request.user)
    profile_form = ProfileEditForm(instance=profile)

    if request.method == 'POST':
        user_form = UserEditForm(instance=request.user, data=request.POST)
        profile_form = ProfileEditForm(instance=profile, data=request.POST, files=request.FILES)
        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            return redirect('edit')

    return render(request, 'accounts/edit.html', {'user_form': user_form, 'profile_form': profile_form})