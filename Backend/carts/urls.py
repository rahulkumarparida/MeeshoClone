#carts/urls.py
from django.urls import path
from .views import GetCartView , AddToCartView , RemoveCartItemView , UpdateCartItemView

urlpatterns=[
    path('' , GetCartView.as_view(),name="get-cart"),
    path('add/' , AddToCartView.as_view(),name="add-to-cart"),
    path('update/<int:pk>/' , UpdateCartItemView.as_view(),name="update-to-cart"),
    path('remove/<int:pk>/' , RemoveCartItemView.as_view(),name="remove-to-cart"),
]