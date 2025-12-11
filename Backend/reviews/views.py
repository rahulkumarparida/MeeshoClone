from rest_framework import generics , permissions
from .models import Review 
from .serializers import ReviewSerializer
from .permissions import CanReviewProduct

# Create your views here.

class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [CanReviewProduct , permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        product_id = self.kwargs['product_id']
        
        return Review.objects.filter(product_id=product_id).select_related('user')

class ReviewDetailsView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)