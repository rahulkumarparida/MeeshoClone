# products/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.db.models import F
from cloudinary.models import CloudinaryField

User = settings.AUTH_USER_MODEL


class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    parent = models.ForeignKey('self', related_name='children', null=True, blank=True, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return f"{self.parent.name + ' / ' if self.parent else ''}{self.name}"
    
    

class Product(models.Model):
    seller = models.ForeignKey(User, related_name='products',limit_choices_to={'role':'seller'}, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.SET_NULL, null=True, blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} -- {self.id}"
    
    
# Change here
class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = CloudinaryField('image', folder='marketplace/products')
    alt_text = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Image for {self.product.title}-{self.product.id}"



class Inventory(models.Model):
    product = models.OneToOneField(Product, related_name='inventory', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)
    reserved = models.PositiveIntegerField(default=0)  # for future locking reservations

    def __str__(self):
        return f"{self.product.title} — {self.quantity}"

    def available(self):
        return max(self.quantity - self.reserved, 0)

    def decrement(self, qty: int):
        """
        Atomically reduce inventory quantity. Raises ValueError if insufficient.
        Use within transaction.atomic() when used in order placement.
        """
        if qty <= 0:
            raise ValueError("qty must be > 0")
        # use F expressions to avoid race conditions
        updated = Inventory.objects.filter(pk=self.pk, quantity__gte=qty).update(quantity=F('quantity') - qty)
        if updated == 0:
            raise ValueError("Insufficient stock")
        # reload
        return Inventory.objects.get(pk=self.pk)