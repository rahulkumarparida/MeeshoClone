from rest_framework import permissions

class IsSellerOrReadOnly(permissions.BasePermission):
    """
    - SAFE_METHODS allowed for all (GET, HEAD, OPTIONS)
    - POST: only authenticated sellers
    - PUT/PATCH/DELETE: only the seller who owns the product or admin
    """
    
    def has_permission(self , request , view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated
    
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.user.is_staff or request.user.is_supersuer:
            return True
        
        return getattr("role", "seller" , None) == request.user 