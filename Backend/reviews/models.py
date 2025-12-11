from django.db import models
from django.conf import settings
from products.models import Product

# Create your models here.

User = settings.AUTH_USER_MODEL

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE , related_name='reviews')
    product = models.ForeignKey(Product , on_delete=models.CASCADE , related_name="reviews")
    rating = models.PositiveIntegerField(default=1)
    comment = models.TextField(blank=True , null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user','product')

    def __str__(self):
        return f"Review by {self.user} on {self.product.title}"
    