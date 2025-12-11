from rest_framework import serializers
from .models import Order , OrderItem
from products.serializers import ProductReadSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductReadSerializer(read_only=True)
    
    class Meta:
        model=OrderItem
        fields=['id', 'product', 'quantity', 'unit_price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True , read_only=True)
    status = serializers.CharField(read_only=True)
    
    class Meta:
        model= Order
        fields = ['id', 'reference_id', 'user', 'created_at', 'status', 'total_amount', 'items']
        read_only_fields = ['id', 'reference_id', 'user', 'created_at', 'status', 'total_amount']
        
        