from django.db import models
from django.conf import settings
from orders.models import Order

# Create your models here.

User = settings.AUTH_USER_MODEL

class Payment(models.Model):
    STATUS_CHOICES = [
        ('unpaid','Unpaid'),    
        ('processing','Processing'),    
        ('paid','Paid'),
        ('failed','failed'),
        ('cancelled','Cancelled'),
    ]
    user = models.ForeignKey(User , on_delete=models.CASCADE , related_name="payments")
    order = models.ForeignKey(Order , on_delete=models.DO_NOTHING , related_name="orders_payment")
    provider_order_id = models.TextField(null=True , blank=True)
    payment_id = models.TextField(null=True , blank=True)
    signature_id = models.TextField(null=True , blank=True)
    amount = models.CharField(max_length=15)
    status = models.CharField(max_length=11 , choices=STATUS_CHOICES , default="unpaid")    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.order} -- {self.user.email}"