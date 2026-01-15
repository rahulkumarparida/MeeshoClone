from django.shortcuts import render , redirect
from django.conf import settings
from .models import Payment
from .serializers import PaymentSerializer
from rest_framework.response import Response
from rest_framework import viewsets ,status
from rest_framework.decorators import APIView
from rest_framework.permissions import IsAuthenticated , IsAdminUser
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.db.models import F
import razorpay


from orders.models import Order , OrderItem
from carts.models import Cart
from orders.tasks import send_order_confirmation_email
from products.models import Inventory , Product
# Create your views here.
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID,settings.RAZORPAY_KEY_SECRET))

class PaymentCallbackViewset(APIView):
    def post(self , request):
        if "razorpay_signature" in request.data:
            try:
                order_id = request.data.get("razorpay_order_id")
                payment_id = request.data.get("razorpay_payment_id")
                signature = request.data.get("razorpay_signature")
            except KeyError:
                return Response({"detail":"Invalid Payload"},status=status.HTTP_400_BAD_REQUEST)

            try:
                order= Order.objects.get(reference_id=order_id)
            except Order.DoesNotExist:
                return Response({"details":"Order does not exist"},status=status.HTTP_400_BAD_REQUEST)
       
            try:
                client.utility.verify_payment_signature({
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature
                })
            except razorpay.errors.SignatureVerificationError:
                with transaction.atomic(): 
                    for items in order.items:
                        Inventory.objects.filter(product=items.product , quantity__gte=items.quantity).update(quantity=F('quantity')+items.quantity) 
                    
                    order.status = "cancelled"
                        
                    order.save()
    
                return Response({"details":"Invalid Signature"},status=status.HTTP_400_BAD_REQUEST)
           
               

            
            
            try:
                with transaction.atomic():
                    payment = Payment.objects.select_for_update().get(order=order) 
                    order = Order.objects.select_for_update().get(reference_id=order_id) 

                    
                    
                    
                    
                    payment.payment_id = payment_id
                    payment.provider_order_id = order.reference_id
                    payment.signature_id = signature
                    payment.status = "paid"
                    
                    payment.save()
                    
                    
                    
                    order.status = "shipped"
                    
                    
                    cart = Cart.objects.get(user=order.user)
                    cart.items.all().delete()
                     # Send Confm. here
                    email_response_id=send_order_confirmation_email.delay(email='rroxx460@gmail.com',orderid=order.id)
                    
                    print("email response here: :",email_response_id)
                    # response = AsyncResult(email_response,app=app)
                        
                    order.save()
                    return redirect(settings.REDIRECT_URL)
                    
                    
            except ValueError as e:
                
                
                
                return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
            
            
            
            
            