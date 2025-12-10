from rest_framework.routers import DefaultRouter
from .views import ProductViewset


router = DefaultRouter()
router.register(r'' , ProductViewset , basename='product')

urlpatterns = router.urls