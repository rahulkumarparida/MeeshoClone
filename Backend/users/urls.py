# users/urls.py
from django.urls import path
from .views import RegisterView, MeView, ProfileUpdateView, LogoutView, ApproveSellerView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view(), name='me'),
    path('me/profile/', ProfileUpdateView.as_view(), name='profile_update'),
    path('seller/approve/<int:seller_id>/', ApproveSellerView.as_view(), name='approve_seller'),
]
