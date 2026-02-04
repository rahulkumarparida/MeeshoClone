
from django.contrib import admin
from django.urls import path , include
from django.conf.urls.static import static
from django.conf import settings
from drf_spectacular.views import SpectacularAPIView , SpectacularRedocView

from .views import health_check

from orders.views import SellerDashboardView
from products.views import ProductEnlistedView , ProductEnlistedDetailsView

urlpatterns = [
    path('',health_check,name="health_cehck_api"),
    path('admin/', admin.site.urls),
    path('users/' , include('users.urls')),
    path('products/', include('products.urls')),
    path('cart/', include('carts.urls')),   
    path('order/', include('orders.urls')),   
    path('reviews/', include('reviews.urls')),   
    path('payment/', include('payments.urls')),   
    
    path('seller/dashboard/',SellerDashboardView.as_view(),name="seller-dashboard"),
    path('seller/products/',ProductEnlistedView.as_view(),name="seller-products"),
    path('seller/products/<str:slug>/',ProductEnlistedDetailsView.as_view(),name="seller-products-details"), 
    
]+static(settings.MEDIA_URL , document_root=settings.MEDIA_ROOT)

