from rest_framework import permissions
from orders.models import OrderItem
from reviews.models import Review

class CanReviewProduct(permissions.BasePermission):
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        user = request.user        
        product_id  = request.data.get('product') or request.parser_context['kwargs'].get('product_pk')
        
        if not product_id:
            return False
        
        has_purchased = OrderItem.objects.filter(
            order__user=user,
            product_id=product_id
        )
        
        return has_purchased