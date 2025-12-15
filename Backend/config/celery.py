import os
from celery import Celery
from time import sleep

os.environ.setdefault('DJANGO_SETTINGS_MODULE' , 'config.settings')

app = Celery('config')


app.config_from_object("django.conf:settings" , namespace='CELERY')


#  Discovers the tasks by scanning through all the apps
app.autodiscover_tasks()
