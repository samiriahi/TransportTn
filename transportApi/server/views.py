from rest_framework.decorators import api_view,authentication_classes, permission_classes
from rest_framework.response import Response
from server.models import Metro
from .serializers import BusSerializer, CommentBusSerializer, CommentSerializer, UserSerializer ,MetroSerializer
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Bus, Comment, CommentBus, CustomUser, Metro
from rest_framework import generics
from rest_framework import filters
from trainapp.serializers import TrainSerializer


####    Users logique    ####
@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = CustomUser.objects.create(
            username=request.data['username'],
            email=request.data['email'],
            is_superuser=request.data.get('is_admin', False),  # Set is_superuser based on the request data
            imageUrl=request.data.get('imageUrl', ''),  # Get imageUrl from request data
        )
        user.set_password(request.data['password'])
        user.save()

        token = Token.objects.create(user=user)
        return Response({'token': token.key, 'user': serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def login(request):
    user = get_object_or_404(CustomUser, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response("missing user", status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(user)
    return Response({'token': token.key, 'user': serializer.data})


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed for {}" .format(request.user.email))


@api_view(['GET'])
def get_user_list(request):
    users = CustomUser.objects.all()
    user_data = []
    for user in users:
        user_data.append({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_admin': user.is_superuser,
            'imageUrl': user.imageUrl,
            'password': user.password,
        })
    return Response(user_data)


@api_view(['PUT'])
def update_user(request, user_id):
    data = request.data
    
    user = get_object_or_404(CustomUser, pk=user_id)
    
    if 'email' in data:
        user.email = data['email']
    if 'imageUrl' in data:
        user.imageUrl = data['imageUrl']
    if 'password' in data:
        user.set_password(data['password'])  # Update the password securely
    
    user.save()

    serializer = UserSerializer(user)
    return Response({'message': 'User updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)

####    Metro logique    ####
@api_view(['POST'])
def add_metro(request):
    serializer = MetroSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_metro_list(request):
    metros = Metro.objects.all()
    
    metros_data = []
    for metro in metros:
        metro_data = {
            'id': metro.id,
            'name': metro.name,
            'depart': metro.depart,
            'destination': metro.destination,
            'ticketTarif': metro.ticketTarif,
            'stations': metro.stations,
            'working_hours': metro.working_hours,
            'comments': []
        }
        
        comments = Comment.objects.filter(metro=metro)
        for comment in comments:
            comment_data = {
                'username': comment.user.username,
                'content': comment.content,
                'created_at': comment.created_at.strftime("%H:%M %d-%m-%Y"),
                'metro_id': comment.metro_id
            }
            metro_data['comments'].append(comment_data)
        
        metros_data.append(metro_data)
    
    return Response(metros_data)



@api_view(['GET'])
def get_metro_by_id(request, metro_id):
    try:
        metro = Metro.objects.get(id=metro_id)
        serializer = MetroSerializer(metro)
        
        # Include comments associated with the metro
        comments = Comment.objects.filter(metro=metro)
        comment_data = CommentSerializer(comments, many=True).data
        
        response_data = serializer.data
        response_data['comments'] = comment_data
        
        return Response(response_data)
    except Metro.DoesNotExist:
        return Response({'message': 'Metro not found'}, status=404)
   

@api_view(['DELETE'])
def delete_metro(request, metro_id):
    try:
        metro = Metro.objects.get(id=metro_id)
    except Metro.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    metro.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['PUT'])  
def update_metro(request, metro_id):
        data = request.data  # Use request.data for JSON content
        
        metro = get_object_or_404(Metro, pk=metro_id)
        
        # Update the fields based on the data received
        if 'name' in data:
            metro.name = data['name']
        if 'depart' in data:
            metro.depart = data['depart']
        if 'destination' in data:
            metro.destination = data['destination']
        if 'ticketTarif' in data:
            metro.ticketTarif = data['ticketTarif']
        if 'stations' in data:
            metro.stations = data['stations']
        if 'working_hours' in data:
            metro.working_hours = data['working_hours']
       
        metro.save()  # Save the updated data

        # Serialize the updated metro and include a success message
        serializer = MetroSerializer(metro)
        return Response({'message': 'Metro updated successfully', 'data': serializer.data}, status=status.HTTP_200_OK)


####    Comment logique    ####
@api_view(['POST'])
def post_comment(request, *args, **kwargs):
    # Obtenez les données de la requête POST
    username = request.data.get('username')  # Nom d'utilisateur
    metro_id = request.data.get('metro_id')  # ID du métro
    content = request.data.get('content')  # Le contenu du commentaire
    
    # Vérifiez si l'utilisateur existe
    try:
        user = CustomUser.objects.get(username=username)
    except CustomUser.DoesNotExist:
        return Response({'message': 'Utilisateur introuvable.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Vérifiez si le métro existe
    try:
        metro = Metro.objects.get(id=metro_id)
    except Metro.DoesNotExist:
        return Response({'message': 'Métro introuvable.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Créez un nouveau commentaire avec les données fournies
    comment = Comment(user=user, metro=metro, content=content)
    comment.save()
    
    # Sérialisez le commentaire créé pour renvoyer dans la réponse
    serializer = CommentSerializer(comment)
    
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_comment_list(request):
    comments = Comment.objects.all()

    serializer = CommentSerializer(comments, many=True) 

    return Response(serializer.data)


@api_view(['DELETE'])
def delete_comment(request, comment_id):
    try:
        comment = Comment.objects.get(pk=comment_id)
    except Comment.DoesNotExist:
        return Response({"message": "Le commentaire n'existe pas."}, status=status.HTTP_404_NOT_FOUND)
    
    comment.delete()
    return Response({"message": "Le commentaire a été supprimé avec succès."}, status=status.HTTP_204_NO_CONTENT)


########    Bus  logique    ##################
@api_view(['POST'])
def add_bus(request):
    serializer = BusSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def get_bus_list(request):
    buss = Bus.objects.all()
    
    buss_data = []
    for bus in buss:
        bus_data = {
            'id': bus.id,
            'name': bus.name,
            'depart': bus.depart,
            'destination': bus.destination,
            'ticketTarif': bus.ticketTarif,
            'stations': bus.stations,
            'working_hours': bus.working_hours,
            'comments': []
        }
        
        comments = CommentBus.objects.filter(bus=bus)
        for comment in comments:
            comment_data = {
                'username': comment.user.username,
                'content': comment.content,
                'created_at': comment.created_at.strftime("%H:%M %d-%m-%Y"),
                'bus_id': comment.bus_id
            }
            bus_data['comments'].append(comment_data)
        
        buss_data.append(bus_data)
    
    return Response(buss_data)


@api_view(['GET'])
def get_bus_by_id(request, bus_id):
    try:
        bus = Bus.objects.get(id=bus_id)
        serializer = BusSerializer(bus)
        
        # Include comments associated with the bus
        comments = CommentBus.objects.filter(bus=bus)
        comment_data = CommentBusSerializer(comments, many=True).data
        
        response_data = serializer.data
        response_data['comments'] = comment_data
        
        return Response(response_data)
    except Metro.DoesNotExist:
        return Response({'message': 'Bus not found'}, status=404)
   

@api_view(['DELETE'])
def delete_bus(request, bus_id):
    try:
        bus = Bus.objects.get(id=bus_id)
    except Bus.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    bus.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)



####   Bus Comment logique    ####
@api_view(['POST'])
def post_bus_comment(request, *args, **kwargs):
    # Obtenez les données de la requête POST
    username = request.data.get('username') 
    bus_id = request.data.get('bus_id')  
    content = request.data.get('content')
    
    # Vérifiez si l'utilisateur existe
    try:
        user = CustomUser.objects.get(username=username)
    except CustomUser.DoesNotExist:
        return Response({'message': 'Utilisateur introuvable.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Vérifiez si le métro existe
    try:
        bus = Bus.objects.get(id=bus_id)
    except Metro.DoesNotExist:
        return Response({'message': 'Bus introuvable.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Créez un nouveau commentaire avec les données fournies
    comment = CommentBus(user=user, bus=bus, content=content)
    comment.save()
    
    # Sérialisez le commentaire créé pour renvoyer dans la réponse
    serializer = CommentBusSerializer(comment)
    
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_bus_comment_list(request):
    comments = CommentBus.objects.all()

    serializer = CommentBusSerializer(comments, many=True) 

    return Response(serializer.data)


@api_view(['DELETE'])
def delete_bus_comment(request, comment_id):
    try:
        comment = CommentBus.objects.get(pk=comment_id)
    except CommentBus.DoesNotExist:
        return Response({"message": "Le commentaire n'existe pas."}, status=status.HTTP_404_NOT_FOUND)
    
    comment.delete()
    return Response({"message": "Le commentaire de cette bus a été supprimé avec succès."}, status=status.HTTP_204_NO_CONTENT)





class TransportSearchView(generics.ListAPIView):
    serializer_class_map = {
        'bus': BusSerializer,
        'metro': MetroSerializer,
        'train': TrainSerializer,
    }
    
    filter_backends = [filters.SearchFilter]
    search_fields = ['depart__icontains', 'destination__icontains', 'stations__icontains', 'working_hours__icontains']

    def post(self, request, *args, **kwargs):
        request_data = request.data

        transport_type = request_data.get('type')
        serializer_class = self.serializer_class_map.get(transport_type)
        
        if serializer_class is None:
            return Response({"error": "Invalid transport type"}, status=400)

        queryset = serializer_class.Meta.model.objects.all()
        
        depart = request_data.get('depart')
        if depart:
            queryset = queryset.filter(depart__icontains=depart)
        
        destination = request_data.get('destination')
        if destination:
            queryset = queryset.filter(destination__icontains=destination)
        
        working_hours = request_data.get('working_hours')
        if working_hours:
            queryset = queryset.filter(working_hours__icontains=working_hours)
        
        serializer = serializer_class(queryset, many=True)
        return Response(serializer.data)

