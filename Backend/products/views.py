from rest_framework import viewsets , filters , status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied
from django.core.cache import cache 
from rest_framework import generics

from .models import Product , ProductImage , Inventory , Category
from .serializers import ProductReadSerializer , ProductImageSerializer , ProductWriteSerializer , InventorySerializer , CategorySerializer
from .permissions import IsSellerOrReadOnly


# Create your views here.
class ProductViewset(viewsets.ModelViewSet):
                                
    queryset = Product.objects.all().select_related('category').prefetch_related('images')
    permission_classes = [IsSellerOrReadOnly]
    filter_backends = [DjangoFilterBackend , filters.SearchFilter , filters.OrderingFilter ]
 
    filterset_fields = {
        'price':['gte','lte'],
        'category__slug': ['exact']
    }
    
    search_fields  = ['title' , 'description']
    ordering_fields = ['price' , 'created_at']
    lookup_field = "slug"
    pagination_class  =None
    
    
    
    def get_serializer_class(self):
        if self.action in ['list' , 'retrieve']:
            
            return ProductReadSerializer
        return ProductWriteSerializer
    
    
    
    def create(self, request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated and user.role != "seller":
            
            raise PermissionDenied("Only Seller can create products") 
        
        
        
        
        return super().create(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        user = self.request.user
        if not user.is_authenticated and user.role != "seller":
            
            raise PermissionDenied("Only Seller can create products") 
        full_path = self.request.get_full_path()
        cache.delete(f"products:{full_path}") 
        serializer.save()
        
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
    
    def perform_update(self, serializer):
        full_path = self.request.get_full_path()
        cache.delete(f"products:{full_path}") 
        return super().perform_update(serializer)  
    
    def get_queryset(self):
        qs = super().get_queryset()
        return qs

    def list(self, request, *args, **kwargs):
        full_path = request.get_full_path()
        cache_key = f"products:{full_path}"
        
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
    
    
    
from .serializers import  InventorySerializer
from django.db.models import Count
from .permissions import IsSellerOnly
class ProductEnlistedView(generics.ListAPIView):
    permission_classes=[IsSellerOnly]
    
    def get(self, request, *args, **kwargs):
        user = request.user
        
        if user.role !="seller":
            
            return Response({"details":"You are not authorised to access this endpoint."},status=status.HTTP_403_FORBIDDEN)
        
        products = Product.objects.filter(seller=user).select_related("inventory").annotate(review_count=Count("reviews"))
        enlisted_array = []
        for i in products:
            img_obj = ProductImage.objects.filter(product=i).first()

            if img_obj:
                product_image = img_obj.image.url
            else:
                product_image = None
            res={
                "id":i.id,
                "name": i.title,
                "slug": i.slug,
                "inventory":i.inventory.quantity,
                "avaliable":i.inventory.available(),
                "reserved": i.inventory.reserved,
                "review_count":i.review_count,
                "created_at": i.created_at,
                "product_image":product_image
            } 
           
            enlisted_array.append(res)
        
        
        return Response(enlisted_array , status=status.HTTP_200_OK)  
                
from django.shortcuts import get_object_or_404       
from reviews.models import Review   
from reviews.serializers import ReviewSerializer
from orders.models import Order , OrderItem
from orders.serializers import OrderItemSerializer
from payments.models import Payment

class ProductEnlistedDetailsView(generics.RetrieveAPIView):
    permission_classes = [IsSellerOnly]
    
    def get(self, request, slug,*args, **kwargs):
        user = request.user
        
        if user.role != "seller":
            return Response({"details":"You are not authorised to access this endpoint."},status=status.HTTP_403_FORBIDDEN)
        
        product = get_object_or_404(Product , seller=request.user , slug=slug)
        if product:
            inventory = Inventory.objects.get(product=product)
            reviews = Review.objects.filter(product=product)
            order_items = OrderItem.objects.filter(product=product)
            
            total_order_qunatity=0
            orders=[]
            for items in order_items:
                order_id = items.order
                total_order_qunatity += items.quantity
                try:
                    payment = Payment.objects.get(order=order_id)
                    
                    res = {
                        "name":items.product.title,
                        "status":order_id.status,
                        "payment_status":payment.status,
                        "quantity":items.quantity,
                        "amount":(float(items.quantity)*float(items.unit_price)),
                        "paid_at":payment.updated_at
                    }
                    orders.append(res)
                except Payment.DoesNotExist:
                    
                    res={
                        "name":items.product.title,
                        "status":order_id.status,
                        "quantity":items.quantity,
                        "amount":(float(items.quantity)*float(items.unit_price)),
                        "created_at":order_id.created_at
                    }
                    orders.append(res)
                    
                    
  
            response = {
                "email":product.seller.email,
                "inventory":InventorySerializer(inventory).data,
                "reviews":ReviewSerializer(reviews,many=True).data,
                "orders":orders ,
                "total_ordered":total_order_qunatity
            }
                
            return Response(response , status=status.HTTP_200_OK)
        

        
        

