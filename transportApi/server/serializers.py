from rest_framework import serializers
from .models import Bus, Comment, CommentBus, CustomUser, Metro

class UserSerializer(serializers.ModelSerializer):

    is_admin = serializers.BooleanField(source='is_superuser', read_only=False)
    class Meta(object):
        model = CustomUser   
        fields = ['id', 'username', 'email', 'is_admin', 'imageUrl' , 'password']



class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    metro_id = serializers.PrimaryKeyRelatedField(source='metro', queryset=Metro.objects.all())
    created_at = serializers.DateTimeField(format="%H:%M %d-%m-%Y") 
    
    class Meta:
        model = Comment
        fields = ["id" ,'username', 'content', 'created_at', 'metro_id']


class MetroSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True, source='comment_set') 
    
    class Meta:
        model = Metro
        fields = ['id', 'name', 'depart', 'destination', 'ticketTarif', 'stations', 'working_hours', 'comments']



class CommentBusSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    bus_id = serializers.PrimaryKeyRelatedField(source='bus', queryset=Bus.objects.all())
    created_at = serializers.DateTimeField(format="%H:%M %d-%m-%Y") 
    
    class Meta:
        model = CommentBus
        fields = ["id" ,'username', 'content', 'created_at', 'bus_id']



class BusSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True, source='comment_set') 
    
    class Meta:
        model = Bus
        fields = ['id', 'name', 'depart', 'destination', 'ticketTarif', 'stations', 'working_hours', 'comments']