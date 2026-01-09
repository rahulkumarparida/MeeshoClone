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
    items = CartItemSerializer(many=True , source="items.all", read_only=True)
    total = serializers.SerializerMethodField()
    class Meta:
        model = Cart
        fields = ['id','user','items','created_at',"total"]
        read_only_fields = ['user','created_at']
    
    def get_total(self ,obj):
        print(obj.items)
        total = 0
        for i in obj.items.all():
            total += (i.quantity*i.unit_price)
        return total

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
    