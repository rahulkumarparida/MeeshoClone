from rest_framework import viewsets , filters , status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Prefetch
from rest_framework.exceptions import PermissionDenied

from .models import Product , ProductImage
from .serializers import ProductReadSerializer , ProductImageSerializer , ProductWriteSerializer
from .permissions import IsSellerOrReadOnly


# Create your views here.
class ProductViewset(viewsets.ModelViewSet):
    queryset = Product.objects.all().select_related('category').prefetch_related('images')
    permission_classes = [IsSellerOrReadOnly]
    filter_backends = [DjangoFilterBackend , filters.SearchFilter , filters.OrderingFilter]
    filterset_fields = {
        'price':['gte','lte'],
        'category':['exact'],
        'is_active':['exact']
    }
    seacrh_fields = ['title' , 'description']
    ordering_fields = ['price' , 'created_at']
    
    def get_serializer_class(self):
        if self.action in ['list' , 'retrieve']:
            return ProductReadSerializer
        return ProductWriteSerializer
    
    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_authenticated and user.role != "seller":
            
            raise PermissionDenied("Only Seller can create products") 
        serializer.save()
        
    
    def get_queryset(self):
        qs = super().get_queryset()
        return qs


