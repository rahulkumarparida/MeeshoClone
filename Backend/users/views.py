# users/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import RegisterSerializer, UserSerializer, ProfileSerializer, SellerProfileSerializer
from .models import User, SellerProfile , Profile
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from core.throttles import RegisteringRateThrottle
from django.db import transaction
from config.services import validate_authorization



'''
{
    email: "",
    first_name: "",
    last_name: "",
    role: "customer",
    phone: "",
    address: "",
    avatar: null,
    business_name: "",
    gst_number: "",
    kyc_document: null,
  }
'''

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    # throttle_classes = [RegisteringRateThrottle]
    
    def create(self, request, *args, **kwargs):
        print("went through here")
        req_data = request.data
        print(req_data)
        try:
            with transaction.atomic():
                fields = ["email","first_name","last_name","role","password","password2","phone"]
                for f in fields:
                    if not request.data.get(f):
                        return Response({"details":f"{f} is missing."},status=status.HTTP_400_BAD_REQUEST)
                if req_data.get("password") != req_data.get("password2"):
                    return Response({"details":f"Password does not match."},status=status.HTTP_400_BAD_REQUEST)
                if req_data.get("role") not in ["seller","customer"]:
                    return Response({"detail":"No such role found"},status=status.HTTP_204_NO_CONTENT)
                
                user = User.objects.create(email=req_data.get("email"),first_name = req_data.get("first_name"),role=req_data.get("role"),last_name = req_data.get("last_name"))
                user.set_password(req_data.get("password"))
                user.save()
                
                profile = Profile.objects.select_for_update().get(user=user)
                profile.phone = req_data.get("phone")
                profile.address = req_data.get("address")
                profile.avatar = req_data.get("avatar")
                profile.save()
                if user.role == "seller":
                    seller_profile = SellerProfile.objects.select_for_update().get(user=user)
                    seller_profile.business_name = req_data.get("business_name")
                    seller_profile.gst_number= req_data.get("gst_number")
                    seller_profile.kyc_document = req_data.get("kyc_document")
                    seller_profile.save()
                serialize = UserSerializer(user).data
            return Response(serialize,status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"details":f"{e}"},status=status.HTTP_400_BAD_REQUEST)
        
        
        
        

class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    # throttle_classes = [RegisteringRateThrottle]

    def get_object(self):
        return self.request.user

class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    # throttle_classes = [RegisteringRateThrottle]

    def get_object(self):
        return self.request.user.profile
    
    def profile_update(self , request , *args , **kwargs):
        print(request.FILES)
        try:
            with transaction.atomic():
                data = request.data
                authorized = User.objects.select_for_update().get(id=request.user.id)
                profile = Profile.objects.select_for_update().get(user=authorized)
                if authorized:
                    authorized.first_name = data['first_name'] or authorized.first_name
                    authorized.last_name = data['last_name'] or authorized.last_name
                    authorized.save()
                    
                    profile.phone = data['phone'] or profile.phone
                    profile.address = data['address'] or profile.address
                    avatar = request.FILES.get('avatar')
                    if avatar:
                        profile.avatar = avatar 
                    else:
                        profile.avatar = profile.avatar
                    profile.save()
                    
                    response = UserSerializer(authorized)
                    print(response)
                    return Response(response.data,status=status.HTTP_202_ACCEPTED)
                    
                    
                return Response({"details":"No user found"}, status=status.HTTP_401_UNAUTHORIZED)
                
            
        except User.DoesNotExist :
            return Response({"details":"No user found"}, status=status.HTTP_401_UNAUTHORIZED)
    
    
    def seller_profile_update(self , request , *args , **kwargs):
        try:
            with transaction.atomic():
                data = request.data
                authorized = User.objects.select_for_update().get(id=request.user.id)
                sellerprofile = SellerProfile.objects.select_for_update().get(user=authorized)
                if authorized and sellerprofile:
                    sellerprofile.business_name = data['business_name'] or sellerprofile.business_name
                    sellerprofile.gst_number = data['gst_number'] or sellerprofile.gst_number
                    kyc_doc= request.FILES.get("kyc_document") 
                    if kyc_doc: 
                        sellerprofile.kyc_document = kyc_doc
                    
                    sellerprofile.save()
                    
                    self.profile_update(self , request , *args , **kwargs)  
                    
        
        except User.DoesNotExist:
            
            return Response({"details":"No user found"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({"details":"No user found"}, status=status.HTTP_401_UNAUTHORIZED)
    
    
    def partial_update(self, request, *args, **kwargs):
        reqUser = request.user
        
        
        if validate_authorization(self , request=request):
            try:
                with transaction.atomic():
                    authUser = User.objects.get(id=reqUser.id)
                    
                    if authUser.role == "customer":
                
                        return self.profile_update( request, *args, **kwargs)
                    
                    if authUser.role == "seller":
                        return  self.profile_update(request, *args, **kwargs)

                
            
            except User.DoesNotExist :
                return Response({"details":"No user found"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({"details":"No user found"}, status=status.HTTP_401_UNAUTHORIZED)
                
            
        return super().partial_update(request, *args, **kwargs)
    
    
    

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


# Required for the frontend to ensure that seller is only accessing the seller based pages
from products.permissions import IsSellerOnly
class RoleViewset(APIView):
    permission_classes=[IsSellerOnly]
    
    def get(self , request , *args , **kwargs):
        
        if request.user.is_authenticated and request.user.role == "seller":
            
            return Response({"status": True},status=status.HTTP_200_OK)
        return Response({"status": False},status=status.HTTP_401_UNAUTHORIZED)