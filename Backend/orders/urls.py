
from django.urls import path
from .views import PlaceOrderView ,OrderDetailsView , OrderHistoryListView , PlaceOrderUpdateView


urlpatterns = [
    path('place/',PlaceOrderView.as_view(), name='place-order'),
    path('place/<int:pk>/',PlaceOrderUpdateView.as_view(), name='place-order-update'),
    path('history/',OrderHistoryListView.as_view() ,name="order-history"),
    path('<int:pk>/',OrderDetailsView.as_view() ,name="order-details"), 
]