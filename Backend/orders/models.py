from django.db import models
from django.conf import settings
from products.models import Product, Inventory

# Create your models here.
User = settings.AUTH_USER_MODEL 

class Order(models.Model):
    STATUS_CHOICES = [
        ('placed','Placed'),
        ('processing','Processing'),
        ('shipped','Shipped'),
        ('delivered','Delivered'),
        ('cancelled','Cancelled'),
    ]
    
    user = models.ForeignKey(User , on_delete=models.CASCADE , related_name='orders')
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20  , choices=STATUS_CHOICES , default='placed')
    total_amount = models.DecimalField(max_digits=12 , decimal_places=2 , default=0)
    reference_id = models.CharField(max_length=120 ,blank=True , null=True)
    
    def __str__(self):
        return f"Order {self.pk} - {self.user}"
    


class OrderItem(models.Model):
    order = models.ForeignKey(Order , related_name='items' , on_delete=models.CASCADE)
    product = models.ForeignKey(Product , on_delete=models.SET_NULL , null=True)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=12 , decimal_places=2)
    
    def line_total(self):
        return self.quantity * self.unit_price



