from rest_framework import serializers
from trainapp.models import CommentTrain, Train

class CommentTrainSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    train_id = serializers.PrimaryKeyRelatedField(source='train', queryset=Train.objects.all())
    created_at = serializers.DateTimeField(format="%H:%M %d-%m-%Y") 
    
    class Meta:
        model = CommentTrain
        fields = ["id" ,'username', 'content', 'created_at', 'train_id']


class TrainSerializer(serializers.ModelSerializer):
    comments = CommentTrainSerializer(many=True, read_only=True, source='comment_set') 
    
    class Meta:
        model = Train
        fields = ['id', 'name', 'depart', 'destination', 'ticketTarif', 'stations', 'working_hours', 'comments']