from django.urls import path
from .views import ReviewDetailsView , ReviewListCreateView

urlpatterns=[
    path("<int:product_id>/", ReviewListCreateView.as_view() , name="review-list-create"),
    path("<int:product_id>/<int:pk>/", ReviewDetailsView.as_view() , name="review-detail"),
]
