from django.urls import path
from django.contrib import admin
from api.views import register, tableViews, login, categoryViews, menuItemViews, TableMenuItemsView, TableMenuItemsListView
from rest_framework.authtoken.views import obtain_auth_token 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', register, name='register'),
    path('api/login/', login.as_view(), name='login'),
    path('api/tables/', tableViews.as_view(), name='createTable'),
    path('api/categories/', categoryViews.as_view(), name='categoryViews'),
    path('api/menuItems/', menuItemViews.as_view(), name='menuItemViews'),
    path('api/tables/<int:table_id>/addMenuItem', TableMenuItemsView.as_view(), name='add_menu_item_to_table'),  
    path('api/tables/<int:table_id>/menu_items/', TableMenuItemsListView.as_view(), name='table_menu_items_list')
]
