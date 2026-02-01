from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .tasks import health_celery

@api_view(['GET'])
def health_check(request):
        task = health_celery.delay()
        return Response({"status": "healthy and working","celery_check":task.id},status=status.HTTP_200_OK)


    