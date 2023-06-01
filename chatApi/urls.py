from django.contrib.auth.decorators import login_required

from .views import ApiProfileViewSet, ApiRoomsViewSet, signup, edit
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from django.contrib.auth import views as auth_views
router = DefaultRouter()

router.register('rooms', ApiRoomsViewSet)
router.register('user', ApiProfileViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('signup/', signup, name='signup'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('login/', auth_views.LoginView.as_view(template_name='accounts/login.html'), name='login'),
    # path('edit/', login_required(edit), name='edit'),
]

