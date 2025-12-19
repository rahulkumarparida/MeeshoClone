from rest_framework.throttling import UserRateThrottle , SimpleRateThrottle

class BurstRateThrottle(UserRateThrottle):
    scope = 'burst' 

class SustainedRateThrottle(UserRateThrottle):
    scope = 'sustained' 
    
    
class RegisteringRateThrottle(SimpleRateThrottle):
    scope = 'auth'
    
    def get_cache_key(self, request, view):
        
        ip_addr = self.get_ident(request=request)
        return self.cache_format % {
            "scope":self.scope,
            "ident":ip_addr
        }