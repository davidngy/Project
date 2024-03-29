from django.db import models
from django.contrib.auth.models import AbstractUser                                                                                                                                                                                                           
from django.conf import settings


class User(AbstractUser):
    pass

class Table(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    number = models.IntegerField(default=0)
    menuItems = models.ManyToManyField('MenuItem', through='TableMenuItem', related_name='tables', blank=True)

    def __str__(self):
        return f"Table {self.user.username} {self.number}"
    


class Category(models.Model):
    user = models.ForeignKey(User, related_name='categories', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"Category {self.menu} {self.name}"

class MenuItem(models.Model):
    category = models.ForeignKey(Category, related_name='menuItems', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f"{self.name} {self.price}"
    
class TableMenuItem(models.Model):
    table = models.ForeignKey(Table, on_delete=models.CASCADE)
    menuItem = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    class Meta:
        # Stellt sicher, dass die Kombination aus table und menuItem einzigartig ist(quantität erhöht)
        unique_together = ('table', 'menuItem')

    def __str__(self):
        return f"{self.table} - {self.menuItem} x {self.quantity}"
