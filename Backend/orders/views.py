from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status , generics , permissions
from django.db import transaction
from django.db.models import F , Prefetch

from django.conf import settings


from carts.models import Cart
from products.models import Inventory
from .models import Order , OrderItem
from .permissions import IsOwnerOrAdmin
from .serializers import OrderSerializer , OrderItemSerializer
from .tasks import send_order_confirmation_email
from payments.models import Payment
import razorpay

# Create your views here.
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID,settings.RAZORPAY_KEY_SECRET))


# Create your views here.
# This class post method works only for Cart not singular products 
class PlaceOrderView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self , request):
        user = request.user
        cart=getattr(user , 'cart',None)
        
        if not cart or not cart.items.exists():
            return Response({"details":"Cart Empty"}, status=status.HTTP_400_BAD_REQUEST)
        
        product_ids = list(cart.items.values_list('product_id',flat=True))
        
        try:
            with transaction.atomic():
                inventories = Inventory.objects.select_for_update().filter(product__in=product_ids).select_related('product')
                
                inv_map = {inv.product_id: inv for inv in inventories}
                
                for item in cart.items.select_related('product'):
                    inv = inv_map.get(item.product.id)
                    
                    if not inv:
                        raise ValueError(f"No inventory for Product {item.product.id}")
                    if inv.available() < item.quantity:
                        raise ValueError(f"Insufficient stock for {item.product.title}")
                
                
                order = Order.objects.create(user=user , total_amount=0 , status="processing" )
                
                total = 0
                for item in cart.items.select_related('product'):
                    inv = inv_map[item.product.id]
                    if  item.quantity > 5 or item.quantity <= 0:
                        return Response({"details":f"Cannot buy more than 5 of this"},status=status.HTTP_406_NOT_ACCEPTABLE)
                        
                    
                    updated = Inventory.objects.filter(pk=inv.pk , quantity__gte=item.quantity).update(quantity=F('quantity')-item.quantity)   
                    
                    if updated == 0:
                        raise ValueError(f"Insufficient stock (concurrent) for {item.product.title}")
                    
                    OrderItem.objects.create(
                        order=order,
                        product=item.product,   
                        quantity=item.quantity,
                        unit_price=item.unit_price
                    )
                    total += float(item.quantity) * float(item.unit_price)
                
                order.total_amount = total
                
               
                
                # payment configuration 
                payment = Payment.objects.create(
                    user=request.user,
                    order=order,
                    amount=total,
                    status="unpaid"
                )
                
                
                order_data = {
                "amount":int(total*100),
                "currency":"INR",
                "payment_capture":"1"
                }
                razorpay_order=client.order.create(order_data)
                order.reference_id = razorpay_order["id"]   

                response = {
                            "order_id":order.id ,
                            "reference_id":order.reference_id,
                            "razorpay_key_id":settings.RAZORPAY_KEY_ID ,
                            "razorpay_callback_url":settings.RAZORPAY_CALLBACK_URL, 
                            "total":order.total_amount ,
                            "email_response_id":request.user.id,
                            "created_at":order.created_at
                            }
                
                order.save()
                payment.save()
                
                return Response(response, status= status.HTTP_201_CREATED)
                
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        


            

# Updates orders
from products.models import Inventory
from products.serializers import InventorySerializer

class PlaceOrderUpdateView(APIView):
    # permission_classes = [IsOwnerOrAdmin]
    
    def patch(self , request , pk=None):
        data = request.data
        if not pk:
            return Response({"details":"provide the order id in order to update the data"} ,status=status.HTTP_400_BAD_REQUEST)
        
        order = Order.objects.get(pk=pk)

        if order.status in ['delivered' ,"cancelled"]:  
            return Response({"details":f"Order is {order.status}"} , status=status.HTTP_204_NO_CONTENT)
        
        
        stat = data.get('status')   

        if stat == 'shipped':
            orderitems = OrderItem.objects.filter(order=pk)
            product_ids = list(orderitems.values_list('product_id',flat=True))
            
            try:
                with transaction.atomic():
                    inventories = Inventory.objects.select_for_update().filter(product__in = product_ids).select_related('product')
                    
                    inv_map = {inv.product_id: inv for inv in inventories}
                    
                    for item in orderitems.select_related('product'): 
                        inv = inv_map[item.product.id]
                        
                        if not inv:
                            return Response({'details':f"Inventory for this product not found {item.product.id}"},status=status.HTTP_404_NOT_FOUND)
                        if inv.available() < item.quantity:
                            return Response({"details":f"Insufficient Stock for {item.product.title}"}, status=status.HTTP_400_BAD_REQUEST)
                        
                        if item.quantity > 5:
                            return Response({"details":f"Cannot buy more than 5 of this"},status=status.HTTP_406_NOT_ACCEPTABLE)
                        
                        updated = Inventory.objects.filter(pk=inv.pk , quantity__gte=item.quantity).update(quantity=F('quantity')-item.quantity)
                        
                        if updated == 0:
                            raise ValueError(f"Insufficient stock (concurrent) for {item.product.title}")
                
                return Response(OrderSerializer(order).data , status=status.HTTP_200_OK)
            
            except Exception as e:
                return Response({'details':f"Exception: {str(e)}"} , status=status.HTTP_400_BAD_REQUEST)
        
        return Response(OrderSerializer(order).data , status=status.HTTP_200_OK)    
        
            
             
            
    

     
    



class OrderDetailsView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes= [permissions.IsAuthenticated , IsOwnerOrAdmin]
    queryset = Order.objects.all().select_related('user').prefetch_related(
        Prefetch('items' , queryset=OrderItem.objects.select_related('product'))
    )
    
class OrderHistoryListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class=None
    
    def get_queryset(self):
        qs=Order.objects.all().select_related('user').prefetch_related(
            Prefetch('items' , queryset=OrderItem.objects.select_related('product'))
        ).order_by('-created_at')
        
        if not self.request.user.is_staff:
            qs = qs.filter(user=self.request.user)
        else:
            user_id = self.request.query_params.get('user')
            if user_id:
                qs.filter(user_id=user_id)
        return qs   
    

from .serializers import SellerDashboardSerializer
from products.models import Product
from django.db.models import Sum, F



#  Seller's Orders
class SellerDashboardView(generics.ListAPIView):
    serializer_class = SellerDashboardSerializer
    permission_classes = [IsOwnerOrAdmin]
    
    def get(self, request, *args, **kwargs):
        
        user=request.user
        
        if user.role !="seller":
            
            return Response({"detail":"You are not authorised to access this endpoint."},status=status.HTTP_403_FORBIDDEN)
        
        total_products = Product.objects.filter(seller=user).count()
        orders = OrderItem.objects.filter(product__seller=user).select_related("order").order_by("order__created_at")
        
        total_order=[]
        for items in orders:
            res={
                "created_at":items.order.created_at,
                "amount":items.order.total_amount
            }
            total_order.append(res)
            
        total_revenue=orders.aggregate(
            revenue=Sum(F("quantity")*F("unit_price"))
        )['revenue'] or 0
            
        oldest_date = orders.first().order.created_at if len(total_order) else None
        latest_date = orders.last().order.created_at if len(total_order) else None
            
        response = {
                "user":user.id,
                "total_products":total_products,
                "total_order":total_order,
                "total_revenue":float(total_revenue),
                "latest_date":latest_date,
                "oldest_date":oldest_date,
            }
        res = self.serializer_class(response).data
        return Response(res , status=status.HTTP_200_OK)

   
        
