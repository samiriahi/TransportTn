from django.db import models

from server.models import CustomUser

# Create your models here.

class Train(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    depart = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    ticketTarif = models.CharField(max_length=100, null=True)
    stations = models.JSONField()  
    working_hours = models.JSONField() 
      


class CommentTrain(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    train = models.ForeignKey(Train, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)