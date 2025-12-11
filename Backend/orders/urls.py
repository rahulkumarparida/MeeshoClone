
from django.urls import path
from .views import PlaceOrderView ,OrderDetailsView , OrderHistoryListView


urlpatterns = [
    path('place/',PlaceOrderView.as_view(), name='place-order'),
    path('history/',OrderHistoryListView.as_view() ,name="order-history"),
    path('<int:pk>/',OrderDetailsView.as_view() ,name="order-details"), 
]