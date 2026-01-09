from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Payment
        fields = ["user","order","payment_id","provider_order_id","signature_id","amount", "status","created_at","updated_at"]
        read_only_fields=["user","order","created_at","updated_at"]
        
    