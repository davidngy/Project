from api.models import User, Table, Category, MenuItem, TableMenuItem
from rest_framework import serializers

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ['id', 'number']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name'] 

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'price', 'category'] 

# Serializer für das TableMenuItem-Modell ManytoMany
class TableMenuItemSerializer(serializers.ModelSerializer):
    menuItem = MenuItemSerializer(read_only=True) 
    quantity = serializers.IntegerField()

    class Meta:
        model = TableMenuItem
        fields = ['menuItem', 'quantity']