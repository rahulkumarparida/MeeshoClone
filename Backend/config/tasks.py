from celery import shared_task
import time

@shared_task
def health_celery():
    time.sleep(5)
    return "Celery is up and running safely."