from celery import shared_task
from time import sleep
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.http import HttpResponse
from weasyprint import HTML , CSS
from django.conf import settings
import datetime

from .models import Order , OrderItem


# @shared_task
def create_order_invoice(email , orderid):
    orderItems = OrderItem.objects.filter(order__id=int(orderid)).values('product__title' , 'quantity','unit_price')
    print(orderItems)
    orders = []
    total = 0.00
    for item in orderItems:
        total += float(item['unit_price']) * float(item['quantity'])
        
        orders.append({
            "title": item['product__title'], # This works because 'item' is a dict
            "quantity": item['quantity'],
            "price": float(item['unit_price'])
        })
    print(orders)
    
    date = datetime.date.today()
    time = datetime.time()
    
    html_string = render_to_string('orderinvoice.html' , {"email":email , "date":date , "time": time  , "orders":orders , "total":total})
    
    pdf_bytes = HTML(string=html_string).write_pdf()
    
    # for viewsets so that the use can see in the website
    # response = HttpResponse(pdf_bytes , content_type='application/pdf')
    # response['Content-Disposition'] = 'inline; filename="invoice.pdf"'
    
    return pdf_bytes



@shared_task
def send_order_confirmation_email(email , orderid):
    sleep(5)
    orderItems = [OrderItem.objects.get(order__id=orderid).product.title]
    print("Order" , orderItems)
    
    
    subject="Order Confirmed!!"
    name=email
    html_path_msg = render_to_string("orderTemplate.html" , {"email":email , "orderItem":orderItems})
    
    plain_message = f"Hurray!! you order has been confirmed."
    from_email="meeshoclone@demomailtrap.co"
    to_email =['rroxx460@gmail.com']
    
    
    
    mail = EmailMessage(subject=subject ,body=html_path_msg , from_email=from_email , to=to_email)
    mail.content_subtype = 'html'
    
    pdf_byte = create_order_invoice(email=email , orderid=orderid)
    
    mail.attach(filename="invoice.pdf" , content=pdf_byte , mimetype="application/pdf")
    
    mail.send()
    print("mail sent to user")    
    
    return {'order':'Order sucessfully created!!'}


