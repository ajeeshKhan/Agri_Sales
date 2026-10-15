from django.db import models
from django.contrib.auth.models import User

ROLE_CHOICES = (
    ('admin', 'Administrator'),
    ('buyer', 'Buyer'),
    ('seller', 'Farmer (Seller)'),
    ('merchant', 'Agri-Merchant'),
)

PRODUCE_CATEGORY_CHOICES = (
    ('vegetables', 'Vegetables'),
    ('rice', 'Rice'),
    ('grains', 'Food Grains'),
    ('fruits', 'Fruits'),
    ('pulses', 'Pulses / Dal'),
)

INPUT_CATEGORY_CHOICES = (
    ('pesticides', 'Pesticides'),
    ('manure', 'Fertilizers & Manure'),
    ('seeds', 'Seeds'),
    ('medicines', 'Crop Medicines'),
)

ORDER_STATUS_CHOICES = (
    ('Confirmed', 'Order Placed & Confirmed'),
    ('Packed', 'Packed by Farmer/Merchant'),
    ('In Transit', 'In Transit'),
    ('Delivered', 'Delivered'),
)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='buyer')
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Farmer specific fields
    farm_name = models.CharField(max_length=150, blank=True, null=True)
    farm_region = models.CharField(max_length=150, blank=True, null=True)
    
    # Buyer specific fields
    business_name = models.CharField(max_length=150, blank=True, null=True)
    business_type = models.CharField(max_length=100, blank=True, null=True)
    delivery_address = models.TextField(blank=True, null=True)
    
    # Merchant specific fields
    store_name = models.CharField(max_length=150, blank=True, null=True)
    license_id = models.CharField(max_length=100, blank=True, null=True)
    
    # Admin specific fields
    department = models.CharField(max_length=100, blank=True, null=True)
    admin_key = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"

class ProduceItem(models.Model):
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=PRODUCE_CATEGORY_CHOICES, default='vegetables')
    farmer_name = models.CharField(max_length=150, default="Green Acres Organic Farm")
    farmer_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='produce_items')
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price in ₹ per unit")
    unit = models.CharField(max_length=20, default='kg')
    stock = models.IntegerField(default=500, help_text="Available stock in kg")
    tag = models.CharField(max_length=100, default='Fresh Harvest')
    icon = models.CharField(max_length=10, default='🌾')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - ₹{self.price}/{self.unit} ({self.stock} {self.unit} left)"

class AgriInput(models.Model):
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=INPUT_CATEGORY_CHOICES, default='pesticides')
    merchant_name = models.CharField(max_length=150, default="Kisan Agri Supplies")
    merchant_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='input_items')
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price in ₹ per unit")
    unit = models.CharField(max_length=50, default='Liter')
    stock = models.IntegerField(default=100)
    desc = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=10, default='🧪')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - ₹{self.price}/{self.unit}"

class Order(models.Model):
    order_number = models.CharField(max_length=50, unique=True)
    buyer_name = models.CharField(max_length=150)
    buyer_email = models.EmailField(blank=True, null=True)
    buyer_phone = models.CharField(max_length=30)
    buyer_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    delivery_address = models.TextField()
    payment_method = models.CharField(max_length=50, default='UPI')
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=50, choices=ORDER_STATUS_CHOICES, default='Confirmed')
    farmer_name = models.CharField(max_length=150, default='Green Acres Organic Farm')
    estimated_delivery = models.CharField(max_length=100, default='Tomorrow by 2:00 PM')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.order_number} - ₹{self.total_amount} ({self.status})"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    produce_item = models.ForeignKey(ProduceItem, on_delete=models.SET_NULL, null=True, blank=True)
    input_item = models.ForeignKey(AgriInput, on_delete=models.SET_NULL, null=True, blank=True)
    item_name = models.CharField(max_length=200)
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.item_name} x {self.quantity} (₹{self.total_price})"
