from rest_framework import viewsets , filters , status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Prefetch
from rest_framework.exceptions import PermissionDenied

from .models import Product , ProductImage , Inventory
from .serializers import ProductReadSerializer , ProductImageSerializer , ProductWriteSerializer , InventorySerializer
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


class InventoryViewset(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [IsSellerOrReadOnly]
    
    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role == "seller": 
            param = self.kwargs.get("product")
            print("param",param)
            
            qs = Inventory.objects.filter(product__id=param)
            return qs
        raise PermissionDenied("Only Seller can view this inventory")
    
    
    def partial_update(self, request, *args, **kwargs):
        if self.request.user.is_authenticated and self.request.user.role == "seller":
            param = self.kwargs.get("product")
            inv = Inventory.objects.get(product__id=param)        
            reqSerializer = InventorySerializer(inv , request.data  , partial=True)
            
            if reqSerializer.is_valid():
            
                reqSerializer.save()   
                print(reqSerializer.data)   
    
                return  Response(reqSerializer.data)
        raise PermissionDenied("Only Seller can view this inventory") 