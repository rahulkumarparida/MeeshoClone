from rest_framework import serializers
from .models import Product , ProductImage , Category , Inventory 
from django.db import models



class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = ProductImage
        fields = ["id" , "image","image_url" , "alt_text"]
        
    
    def get_image_url(self , obj):
        qs = obj.image
        
        return qs.url
        
    
class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ["id" , "name" , "slug" , "parent" , "children"]
        
    
    def get_children(self , obj):
        qs = obj.children.all()
        return CategorySerializer(qs , many=True , context= self.context).data
    


class ProductReadSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True , read_only=True)
    category = CategorySerializer(read_only=True)
    inventory = serializers.IntegerField(source="inventory.quantity" , read_only=True)
    available = serializers.IntegerField(source="inventory.reserved" , read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    
    class Meta:
        model=Product
        fields=['id','title','slug','description','price','category','images','inventory','available','seller','average_rating','review_count','is_active','created_at']
        read_only_fields = ['seller','inventory','available','average_rating','review_count','created_at']
        
    
    def get_average_rating(self,obj):
        return obj.reviews.aggregate(avg=models.Avg('rating'))['avg']
    
    
    def get_review_count(self,obj):
        return obj.reviews.count()
    
    

    

class ProductWriteSerializer(serializers.ModelSerializer):
    images = serializers.ListField(child=serializers.ImageField() , write_only=True , required=False)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(),allow_null=True , required=False)
    
    class Meta:
        model = Product
        fields = ['title','slug','description','price','category','images','is_active']
        
        
    def create(self, validated_data):
        images = validated_data.pop('images',[])
        seller = self.context['request'].user
        product = Product.objects.create(seller=seller,**validated_data)
        
        
        for img in images:
            ProductImage.objects.create(product=product , image=img)
            
        return product
    
    
    def update(self, instance, validated_data):
        print("Came till serializer")
        images = validated_data.pop("images",None)
        for attr , val in validated_data.items():
            setattr(instance,attr , val)
        instance.save()
        if images is not None:
            
            for img in images:
                ProductImage.objects.create(product=instance , images=img)
        return  instance
    
    
class InventorySerializer(serializers.ModelSerializer):
    
    
    class Meta:
        model = Inventory
        fields = ["product" , "quantity" , "reserved"]
        
    





    




