from django.db.models.signals import post_save , post_delete
from django.dispatch import receiver
from .models import Inventory , Product , ProductImage
import cloudinary.uploader


@receiver(post_save  , sender=Product)
def create_inventory(sender , instance , created , **kwargs):
    if created:
        Inventory.objects.create(product=instance)


@receiver(post_delete , sender=ProductImage)
def remove_cloudinary_image(sender , instance , **kwargs):
    
    public_id = getattr(instance.image , 'public_id' , None) or instance.image.name
    
    if public_id:
        try:
            cloudinary.uploader.destroy(public_id=public_id , invalidate=True , resource_type = 'image')
        except Exception:
            pass
        