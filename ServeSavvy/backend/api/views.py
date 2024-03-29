from django.contrib.auth.forms import UserCreationForm
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import TableSerializer, CategorySerializer, MenuItemSerializer, TableMenuItemSerializer
from .models import Table, User, MenuItem, Category, TableMenuItem
from rest_framework.permissions import IsAuthenticated


User = get_user_model()

class CreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = UserCreationForm.Meta.fields + ('email',)

@api_view(['POST'])
def register(request):
    form = CreationForm(request.data)
    print(request.data)
    if form.is_valid():
        user = form.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({'user_id': user.id, 'token': token.key}, status=status.HTTP_201_CREATED)
    else:
        print(form.errors.as_json())
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
    
class login(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super(login, self).post(request, *args, **kwargs) #login process and getting token
        if response.status_code == 200: # Erfolgreiche Authentifizierung
            token = Token.objects.get(key=response.data['token']) #have token check which user it belongs to
            return Response({'token': token.key, 'user_id': token.user_id}) # Angepasste Antwort
        return response

class tableViews(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        tables = Table.objects.filter(user=request.user).order_by('number')
        serializer = TableSerializer(tables, many=True)
        return Response(serializer.data)
    

    def post(self, request, *args, **kwargs):
        last_box = Table.objects.filter(user=request.user).order_by('-number').first() #1
        next_number = 1 #1
        if last_box:
            next_number = last_box.number + 1

        data = request.data.copy()  #mutable
        data['number'] = next_number
        data['user'] = request.user.id

        serializer = TableSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, *args, **kwargs):
        latest_table = Table.objects.filter(user=request.user).order_by('-number').first()
        
        if not latest_table:
            return Response({'error': 'Keine Tabelle zum Löschen vorhanden'}, status=status.HTTP_404_NOT_FOUND)
        
        latest_table.delete()
        
        return Response({'message': 'Tabelle erfolgreich gelöscht'}, status=status.HTTP_204_NO_CONTENT)

class categoryViews(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        categories = Category.objects.filter(user=request.user)
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class menuItemViews(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        category_id = request.query_params.get('categoryId')
        if category_id:
            category = get_object_or_404(Category, id=category_id)
            menuItems = MenuItem.objects.filter(category=category)
        else:
            menuItems = MenuItem.objects.all()  
        serializer = MenuItemSerializer(menuItems, many=True)
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        serializer = MenuItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    
class TableMenuItemsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, table_id):
        try:
            table = Table.objects.get(id=table_id, user=request.user)
            menu_items = table.menuItems.all() 
            serializer = MenuItemSerializer(menu_items, many=True)
            return Response(serializer.data)
        except Table.DoesNotExist:
            return Response({'error': 'Tisch nicht gefunden'}, status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request, table_id):
        try:
            table = get_object_or_404(Table, id=table_id, user=request.user)
            menu_item_id = request.data.get('menuItemId')
            quantity = request.data.get('quantity') 
            menu_item = get_object_or_404(MenuItem, id=menu_item_id)

            # Überprüfen, ob der Menüpunkt bereits hinzugefügt wurde
            table_menu_item, created = TableMenuItem.objects.get_or_create(
                table=table,
                menuItem=menu_item,
                defaults={'quantity': quantity}
            )

            if not created:
                # Wenn der Eintrag bereits existiert, aktualisiere die Menge
                table_menu_item.quantity += 1;
                table_menu_item.save()

            return Response({'message': 'Menüpunkt erfolgreich hinzugefügt/aktualisiert'}, status=status.HTTP_200_OK)

        except Table.DoesNotExist as e:
            return Response({'error': 'Tisch nicht gefunden'}, status=status.HTTP_404_NOT_FOUND)
        except MenuItem.DoesNotExist as e:
            return Response({'error': 'Menüpunkt nicht gefunden'}, status=status.HTTP_404_NOT_FOUND)
    
    
class TableMenuItemsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, table_id, *args, **kwargs):
        try:
            table = Table.objects.get(id=table_id, user=request.user)  # Stelle sicher, dass der Tisch dem Benutzer gehört
            table_menu_items = TableMenuItem.objects.filter(table=table)  # Hole alle TableMenuItem, die zum Tisch gehören
            
            serializer = TableMenuItemSerializer(table_menu_items, many=True)
            return Response(serializer.data)
        except Table.DoesNotExist:
            return Response({'error': 'Tisch nicht gefunden'}, status=404)
        
    def delete(self, request, table_id):
        # gehört user und Tisch exestiert
        table = get_object_or_404(Table, id=table_id, user=request.user)
        
        # Lösche alle TableMenuItem, die zum Tisch gehören
        TableMenuItem.objects.filter(table=table).delete()

        return Response({'message': 'Alle Menüpunkte wurden erfolgreich vom Tisch entfernt.'}, status=status.HTTP_204_NO_CONTENT)