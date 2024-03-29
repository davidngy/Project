from django.contrib import admin 
from .models import User, Table, Category

# Register your models here.
admin.site.register(User),
admin.site.register(Table),
admin.site.register(Category)