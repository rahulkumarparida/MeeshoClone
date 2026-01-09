
from django.urls import path
from .views import PaymentCallbackViewset


urlpatterns = [
    path('verify/',PaymentCallbackViewset.as_view(), name='payment'),

]