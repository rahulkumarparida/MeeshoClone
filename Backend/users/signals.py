# users/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Profile, SellerProfile

@receiver(post_save, sender=User)
def create_profiles(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        if instance.role == 'seller':
            SellerProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_profiles(sender, instance, **kwargs):
    if instance.role == 'seller' and getattr(instance, 'seller_profile', None) is None:
        SellerProfile.objects.get_or_create(user=instance)
