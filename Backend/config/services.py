import requests
import jwt
import logging
from django.conf import settings
from rest_framework.exceptions import ValidationError, AuthenticationFailed
logger = logging.getLogger(__name__) 
from users.models import User

def validate_authorization(self, request):    
    """Validate JWT token from request"""
    if not request:
        raise AuthenticationFailed("Request context not available")
        
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        raise AuthenticationFailed("Authorization header missing or invalid")
        
    token = auth_header.split(' ')[1]
    try:
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = int(decoded.get('user_id'))

        if not user_id:
            raise AuthenticationFailed("Invalid token: user_id not found")
      
        return User.objects.filter(id=user_id).exists()
        
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Token has expired")
    except jwt.DecodeError:
        raise AuthenticationFailed("Invalid token")
    except Exception as e:
        logger.error(f"JWT decoding error: {str(e)}")
        raise AuthenticationFailed("Token validation failed")
    
