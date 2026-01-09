from django.shortcuts import render
from django.conf import settings
from .models import Payment
from .serializers import PaymentSerializer
from rest_framework.response import Response
from rest_framework import viewsets ,status
from rest_framework.decorators import APIView
from rest_framework.permissions import IsAuthenticated , IsAdminUser
from django.shortcuts import get_object_or_404
from django.db import transaction
import razorpay


from orders.models import Order , OrderItem

# Create your views here.
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID,settings.RAZORPAY_KEY_SECRET))

class PaymentCallbackViewset(APIView):
    def post(self , request):
        if "razorpay_signature" in request.POST:
            order_id = request.POST.get("razorpay_order_id")
            payment_id = request.POST.get("razorpay_payment_id")
            signature = request.POST.get("razorpay_signature")


            order = Order.objects.get(reference_id=order_id)
            
       

            verification =client.utility.verify_payment_signature({
            'razorpay_order_id': order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature
            })
            # status shipped
            if verification:
                try:
                    with transaction.atomic():
                        payment = Payment.objects.select_for_update().get(order=order) 
                        order = Order.objects.select_for_update().get(reference_id=order_id)
#    fields = ["user","order","payment_id","provider_order_id","signature_id","amount", "status","created_at","updated_at"] 
                        payment.payment_id = payment_id
                        payment.provider_order_id = order.reference_id
                        payment.signature_id = signature
                        payment.status = "paid"
                        
                        payment.save()
                        
                        order.status = "shipped"
                        order.save()
                        
                        response = {"status":"success"}
                        return Response({"details":response},status=status.HTTP_202_ACCEPTED)
                        
                        
                except ValueError as e:
                    
                    return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            else:
                
                return Response({"details":"failed"},status=status.HTTP_400_BAD_REQUEST)
            
            
            
            
            