# users/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import RegisterSerializer, UserSerializer, ProfileSerializer, SellerProfileSerializer
from .models import User, SellerProfile
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from core.throttles import RegisteringRateThrottle


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [RegisteringRateThrottle]

class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [RegisteringRateThrottle]

    def get_object(self):
        return self.request.user

class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [RegisteringRateThrottle]

    def get_object(self):
        return self.request.user.profile

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class ApproveSellerView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, seller_id):
        try:
            sp = SellerProfile.objects.get(pk=seller_id)
            sp.is_approved = True
            sp.save()
            return Response({"detail":"approved"}, status=status.HTTP_200_OK)
        except SellerProfile.DoesNotExist:
            return Response({"detail":"not found"}, status=status.HTTP_404_NOT_FOUND)
