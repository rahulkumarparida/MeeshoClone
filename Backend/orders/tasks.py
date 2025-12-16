from celery import shared_task
from time import sleep
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.http import HttpResponse



from .models import Order , OrderItem

@shared_task
def send_order_confirmation_email(email , orderid):
    sleep(10)
    orderItems = [OrderItem.objects.get(order__id=orderid).product.title]
    print("Order" , orderItems)
    
    
    subject="Order Confirmed!!"
    name=email
    html_message=f"""
    <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Confirmed</title>
            </head>
            <body>
                <h1>Hurray!! Your order is confirmed</h1>
                    { email }
                    { orderItems }
                    
            </body>
        </html>
    
    """
    plain_message = f"Hurray!! you order has been confirmed."
    from_email="meeshoclone@demomailtrap.co"
    to_email =['rroxx460@gmail.com']
    
    # mail = EmailMessage(subject=subject ,body=html_message , from_email=from_email , to=to_email)
    # mail.content_subtype = 'html'
    
    # mail.send()
    print("mail sent to user")    
    
    return {'order':'Order sucessfully created!!'}
