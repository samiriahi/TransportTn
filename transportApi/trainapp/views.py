from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from server.models import CustomUser
from trainapp.models import CommentTrain, Train
from trainapp.serializers import CommentTrainSerializer, TrainSerializer
from rest_framework import status


# Create your views here.

@api_view(['POST'])
def add_train(request):
    serializer = TrainSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_train_list(request):
    trains = Train.objects.all()
    
    trains_data = []
    for train in trains:
        train_data = {
            'id': train.id,
            'name': train.name,
            'depart': train.depart,
            'destination': train.destination,
            'ticketTarif': train.ticketTarif,
            'stations': train.stations,
            'working_hours': train.working_hours,
            'comments': []
        }
        
        comments = CommentTrain.objects.filter(train=train)
        for comment in comments:
            comment_data = {
                'username': comment.user.username,
                'content': comment.content,
                'created_at': comment.created_at.strftime("%H:%M %d-%m-%Y"),
                'train_id': comment.train_id
            }
            train_data['comments'].append(comment_data)
        
        trains_data.append(train_data)
    
    return Response(trains_data)



@api_view(['GET'])
def get_train_by_id(request, train_id):
    try:
        train = Train.objects.get(id=train_id)
        serializer = TrainSerializer(train)
        
        # Include comments associated with the train
        comments = CommentTrain.objects.filter(train=train)
        comment_data = CommentTrainSerializer(comments, many=True).data
        
        response_data = serializer.data
        response_data['comments'] = comment_data
        
        return Response(response_data)
    except Train.DoesNotExist:
        return Response({'message': 'Train not found'}, status=404)
   
    
@api_view(['PUT'])  
def update_train(request, train_id):
        data = request.data  # Use request.data for JSON content
        
        train = get_object_or_404(Train, pk=train_id)
        
        # Update the fields based on the data received
        if 'name' in data:
            train.name = data['name']
        if 'depart' in data:
            train.depart = data['depart']
        if 'destination' in data:
            train.destination = data['destination']
        if 'ticketTarif' in data:
            train.ticketTarif = data['ticketTarif']
        if 'stations' in data:
            train.stations = data['stations']
        if 'working_hours' in data:
            train.working_hours = data['working_hours']
       
        train.save()  # Save the updated data

        # Serialize the updated train and include a success message
        serializer = TrainSerializer(train)
        return Response({'message': 'Train updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)


@api_view(['DELETE']) 
def delete_train(request, train_id):
    try:
        train = Train.objects.get(id=train_id)
    except Train.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    train.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)



####    Comment for train logique    ####
@api_view(['POST'])
def post_comment(request, *args, **kwargs):
    # Obtenez les données de la requête POST
    username = request.data.get('username') 
    train_id = request.data.get('train_id')  
    content = request.data.get('content')  
    
    # Vérifiez si l'utilisateur existe
    try:
        user = CustomUser.objects.get(username=username)
    except CustomUser.DoesNotExist:
        return Response({'message': 'Utilisateur introuvable.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Vérifiez si le train existe
    try:
        train = Train.objects.get(id=train_id)
    except Train.DoesNotExist:
        return Response({'message': 'Train introuvable.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Créez un nouveau commentaire avec les données fournies
    comment = CommentTrain(user=user, train=train, content=content)
    comment.save()
    
    serializer = CommentTrainSerializer(comment)
    
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_trains_comment_list(request):
    trains_comments = CommentTrain.objects.all()
    
    serializer = CommentTrainSerializer(trains_comments, many=True) 
    
    return Response(serializer.data)


@api_view(['DELETE'])
def delete_comment(request, comment_id):
    try:
        comment = CommentTrain.objects.get(pk=comment_id)
    except CommentTrain.DoesNotExist:
        return Response({"message": "Le commentaire n'existe pas."}, status=status.HTTP_404_NOT_FOUND)
    
    comment.delete()
    return Response({"message": "Le commentaire a été supprimé avec succès de ce train."}, status=status.HTTP_204_NO_CONTENT)
