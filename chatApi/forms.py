from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


from .models import Room


class SignUpForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'password1', 'password2']


from django import forms


class RoomForm(forms.ModelForm):
    class Meta:
        model = Room
        fields = ['name', ]
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 5}),
        }
