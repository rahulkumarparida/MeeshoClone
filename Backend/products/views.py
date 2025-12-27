from rest_framework import viewsets , filters , status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Prefetch
from rest_framework.exceptions import PermissionDenied
from django.core.cache import cache 


from .models import Product , ProductImage , Inventory , Category
from .serializers import ProductReadSerializer , ProductImageSerializer , ProductWriteSerializer , InventorySerializer , CategorySerializer
from .permissions import IsSellerOrReadOnly


# Create your views here.
class ProductViewset(viewsets.ModelViewSet):
    queryset = Product.objects.all().select_related('category').prefetch_related('images')
    # permission_classes = [IsSellerOrReadOnly]
    filter_backends = [DjangoFilterBackend , filters.SearchFilter , filters.OrderingFilter ]
 
    filterset_fields = {
        'price':['gte','lte'],
        'category__slug': ['exact']
    }
    search_fields  = ['title' , 'description']
    ordering_fields = ['price' , 'created_at']
    
    
    
    
    def get_serializer_class(self):
        if self.action in ['list' , 'retrieve']:
            
            return ProductReadSerializer
        return ProductWriteSerializer
    
    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_authenticated and user.role != "seller":
            
            raise PermissionDenied("Only Seller can create products") 
        cache.delete("products") 
        serializer.save()
    
    def perform_update(self, serializer):
        cache.delete("products") 
        return super().perform_update(serializer)  
    
    def get_queryset(self):
        qs = super().get_queryset()
        return qs

    def list(self, request, *args, **kwargs):
        cache_key = f"products:{request.get_full_path()}"
        
        data = cache.get(cache_key)
        if data:
            return Response(data)

        response = super().list(request, *args, **kwargs)
        cache.set(cache_key, response.data, timeout=60)
        return response


    
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
    
    
class ProductImageViewset(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    
    
    def create(self, request, *args, **kwargs):
        user = request.user
        data = request.data
        files = request.FILES.getlist('image')
        role = getattr(user , "role" , None)
        if not role:
            return Response({"details":"Unauthorized access not allowed."} , status=status.HTTP_401_UNAUTHORIZED)
        
        if role == "customer":
            return Response({"details":"You are not allowed to do this."} , status=status.HTTP_403_FORBIDDEN)
        
        product_instance = Product.objects.get(id=int(data.get('product')))
        
        if not files:
            return Response({"details":"No files found in the iamge"} , status=status.HTTP_400_BAD_REQUEST)
        created = []
        for f in files:
            valid_data = {
                "product":product_instance,
                "image":f,
                "alt_text": data.get('alt_text')
            }
            img = ProductImage.objects.create(**valid_data)
            created.append(ProductImageSerializer(img).data)
         
        return Response({"uploaded":created} , status=status.HTTP_201_CREATED)
    


class CartegoryViewset(viewsets.ModelViewSet):
    queryset = Category.objects.filter(parent=None)
    serializer_class = CategorySerializer
    pagination_class = None
    