from rest_framework import serializers
from .models import Cart , CartItem
from products.serializers import ProductReadSerializer
from products.models import Product

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductReadSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all() , source='product' , write_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id','product','product_id','quantity','unit_price']
        
        
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)
    
    class Meta:
        model = Cart
        fields = ['id','user','items','created_at']
        read_only_fields = ['user','created_at']
        

class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    

    
    def validate_product_id(self, value):
        try:
            return Product.objects.get(pk=value)
        except:
            raise serializers.ValidationError("Product does not exist.")
    
    def validate(self, attrs):
        product = attrs["product_id"]
        qty=attrs["quantity"]
        inv = getattr(product , "inventory" , None)
        if inv and inv.available() < qty:
            raise serializers.ValidationError(f"Only {inv.available()} items avaliable for {product.title}")
        return super().validate(attrs)
    