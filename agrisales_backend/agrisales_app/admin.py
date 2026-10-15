from django.contrib import admin
from .models import UserProfile, ProduceItem, AgriInput, Order, OrderItem

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'phone', 'farm_name', 'store_name')
    list_filter = ('role',)
    search_fields = ('user__username', 'user__email', 'phone')

@admin.register(ProduceItem)
class ProduceItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'farmer_name', 'price', 'stock', 'tag')
    list_filter = ('category', 'tag')
    search_fields = ('name', 'farmer_name')

@admin.register(AgriInput)
class AgriInputAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'merchant_name', 'price', 'stock', 'unit')
    list_filter = ('category',)
    search_fields = ('name', 'merchant_name')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'buyer_name', 'total_amount', 'payment_method', 'status', 'created_at')
    list_filter = ('status', 'payment_method')
    search_fields = ('order_number', 'buyer_name', 'buyer_email')
    inlines = [OrderItemInline]
