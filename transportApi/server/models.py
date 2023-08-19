from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    imageUrl = models.URLField(blank=True)

    def __str__(self):
        return self.username


class Metro(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    depart = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    ticketTarif = models.CharField(max_length=100, null=True)
    stations = models.JSONField()  
    working_hours = models.JSONField()  # pas d'attribut comments ici
      


class Comment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    metro = models.ForeignKey(Metro, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    

class Bus(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    depart = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    ticketTarif = models.CharField(max_length=100, null=True)
    stations = models.JSONField()  
    working_hours = models.JSONField() 

class CommentBus(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

