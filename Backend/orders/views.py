from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.db.models import F

from carts.models import Cart
from products.models import Inventory
from .models import Order , OrderItem

# Create your views here.
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
                
                order = Order.objects.create(user=user , total_amount=0)
                total = 0
                for item in cart.items.select_related('product'):
                    inv = inv_map[item.product.id]
                    
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
                order.save()
                
                cart.items.all().delete()
                
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"order_id":order.id , "total":order.total_amount}, status= status.HTTP_201_CREATED)
