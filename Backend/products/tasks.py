from celery import shared_task
from time import sleep 
from products.models import Product , ProductImage


@shared_task
def upload_product_images_to_cloudinary(product_id , images):
    print(f"Uploading images for product {product_id} to Cloudinary")
    sleep(5)
    product = Product.objects.get(id=product_id)
    for image in images:

        ProductImage.objects.create(product=product, image=image , alt_text=f"{product.title} not available")

    

    
    