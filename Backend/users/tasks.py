from celery import shared_task
from time import sleep 
from .models import SellerProfile


@shared_task
def approve_seller(seller):
    pass