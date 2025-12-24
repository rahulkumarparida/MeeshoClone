from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import ProductViewset , InventoryViewset , ProductImageViewset , CartegoryViewset


router = DefaultRouter()
router.register(r'' , ProductViewset , basename='product')

urlpatterns = [
    path("<int:product>/inventory/" , InventoryViewset.as_view({'get': 'list' , 'patch':'partial_update'}) , name='inventory'),
    path('images/' , ProductImageViewset.as_view({'post':"create"}) , name="product-image"),
    path('categories/' , CartegoryViewset.as_view({'get':"list"}) , name="categories")
    
    ]+router.urls