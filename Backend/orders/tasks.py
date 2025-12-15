from celery import shared_task
from time import sleep


from .models import Order , OrderItem
@shared_task
def send_order_confirmation_email(email , orderid):
    sleep(10)
    order = Order.objects.get(id=orderid)
    
    print("Order" , order)
    
    return {'order':'Order sucessfully created!!'}
