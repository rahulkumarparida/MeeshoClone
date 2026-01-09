from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Cart, CartItem
from .serializers import CartSerializer, AddToCartSerializer, CartItemSerializer
from products.models import Product


# Create your views here.

class GetCartView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        cart,_ = Cart.objects.get_or_create(user = self.request.user)
        return cart
    
class AddToCartView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AddToCartSerializer
    
    def post(self, request, *args, **kwargs):
        seralize = self.get_serializer(data=request.data)
        seralize.is_valid(raise_exception=True)
        product = seralize.validated_data['product_id']
        qty = seralize.validated_data['quantity']
        
        cart, _ = Cart.objects.get_or_create(user=request.user)
        item , created = CartItem.objects.get_or_create(cart=cart,product=product,defaults={
            'quantity':qty,
            'unit_price':product.price
            })
        if not created:
            item.quantity += qty
            item.unit_price += product.price
            item.save()
        return Response(CartSerializer(cart , context={'request':request}).data , status=status.HTTP_200_OK)
    
class UpdateCartItemView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    serializer_class = CartItemSerializer
    
    
    
    def patch(self, request, *args, **kwargs):
        pk = self.kwargs.get("pk")
        try:
            item = CartItem.objects.get(pk=pk , cart__user= request.user)
            
        except CartItem.DoesNotExist:
            return Response({"detail": "Item not found."}, status=status.HTTP_404_NOT_FOUND)
        qty = request.data.get('quantity')
        if qty is None:
             return Response({"detail": "quantity required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            qty = int(qty)
        except Exception:
            return  Response({"detail": "quantity must be an integer"}, status=status.HTTP_400_BAD_REQUEST)
        
        item.quantity = qty
        item.save()
        return Response(CartItemSerializer(item, context={'request': request}).data, status=status.HTTP_200_OK)
     
     
     
from rest_framework.exceptions import PermissionDenied
    
class RemoveCartItemView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    
    def get_object(self):
        obj = super().get_object()
        if obj.cart.user != self.request.user:
            return PermissionDenied()
        return obj
    
    def delete(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk')
        try:
            item = CartItem.objects.get(id=pk, cart__user=request.user)
            if not item:
                return PermissionDenied()
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CartItem.DoesNotExist:
            return Response({"detail": "Item not found."}, status=status.HTTP_404_NOT_FOUND)
    