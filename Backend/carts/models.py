from django.db import models
from django.conf import settings
from products.models import Product
# Create your models here.
User = settings.AUTH_USER_MODEL

class Cart(models.Model):
    user = models.OneToOneField(User , on_delete=models.CASCADE , related_name='cart' , null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Cart{self.pk} - {self.user or 'guest'}"
    
    def total_items(self):
        return self.items.aggregate(total=models.Sum('quantity'))['total'] or 0
    
    def subtotal(self):
        return  sum([item.quantity * item.unit_price for item in self.items.select_related('product')])
    
    
class CartItem(models.Model):
    cart = models.ForeignKey(Cart , related_name='items' , on_delete=models.CASCADE)
    product = models.ForeignKey(Product , on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=12,decimal_places=2)
    
    class Meta:
        unique_together = ('cart' , 'product')
        
    def __str__(self):
        return f"{self.product.title} x {self.quantity}"
    