from .views import ApiProfileViewSet, ApiRoomsViewSet
from rest_framework.routers import DefaultRouter
from django.urls import path, include

router = DefaultRouter()

router.register('rooms', ApiRoomsViewSet)
router.register('user', ApiProfileViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
