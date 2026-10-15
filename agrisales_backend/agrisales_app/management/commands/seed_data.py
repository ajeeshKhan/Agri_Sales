from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from agrisales_app.models import UserProfile, ProduceItem, AgriInput

class Command(BaseCommand):
    help = 'Seeds initial users, produce catalog, and agri-inputs catalog into SQLite database'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("Starting AgriSales database seeding..."))

        # Seed Users
        users_data = [
            {
                'email': 'admin@agrisales.com',
                'username': 'admin_master',
                'name': 'System Admin',
                'password': 'Admin@1234',
                'role': 'admin',
                'department': 'Security & Operations',
                'admin_key': 'ADMIN-2026-KEY'
            },
            {
                'email': 'buyer@freshmarket.com',
                'username': 'buyer_wholesale',
                'name': 'Alex Johnson',
                'password': 'Buyer@1234',
                'role': 'buyer',
                'phone': '+91 98765-43210',
                'business_name': 'Fresh Market Retail',
                'business_type': 'retailer',
                'delivery_address': 'Plot 42, APMC Market, Sector 18, Vashi, Navi Mumbai'
            },
            {
                'email': 'farmer@greenacres.com',
                'username': 'farmer_ramesh',
                'name': 'Ramesh Patil',
                'password': 'Farmer@1234',
                'role': 'seller',
                'phone': '+91 94221-88900',
                'farm_name': 'Green Acres Organic Farm',
                'farm_region': 'Nashik, Maharashtra'
            },
            {
                'email': 'merchant@agrisupply.com',
                'username': 'merchant_rajesh',
                'name': 'Rajesh Kumar',
                'password': 'Merchant@1234',
                'role': 'merchant',
                'phone': '+91 98220-11223',
                'store_name': 'Kisan Agri Supplies & Fertilizers',
                'license_id': 'PEST-REG-5542'
            }
        ]

        for u_data in users_data:
            if not User.objects.filter(email__iexact=u_data['email']).exists():
                user = User.objects.create_user(
                    username=u_data['username'],
                    email=u_data['email'],
                    password=u_data['password'],
                    first_name=u_data['name']
                )
                UserProfile.objects.create(
                    user=user,
                    role=u_data['role'],
                    phone=u_data.get('phone', ''),
                    farm_name=u_data.get('farm_name', ''),
                    farm_region=u_data.get('farm_region', ''),
                    business_name=u_data.get('business_name', ''),
                    business_type=u_data.get('business_type', ''),
                    delivery_address=u_data.get('delivery_address', ''),
                    store_name=u_data.get('store_name', ''),
                    license_id=u_data.get('license_id', ''),
                    department=u_data.get('department', ''),
                    admin_key=u_data.get('admin_key', '')
                )
                self.stdout.write(self.style.SUCCESS(f"Seeded user: {u_data['email']} ({u_data['role']})"))

        # Seed Produce Catalog
        produce_items = [
            { 'name': 'Organic Shimla Apples', 'category': 'fruits', 'farmer_name': 'Green Acres Organic Farm', 'price': 160, 'unit': 'kg', 'stock': 450, 'tag': 'Certified Organic', 'icon': '🍎' },
            { 'name': 'Fresh Hybrid Tomatoes', 'category': 'vegetables', 'farmer_name': 'Nashik Farms', 'price': 35, 'unit': 'kg', 'stock': 300, 'tag': 'Non-GMO', 'icon': '🍅' },
            { 'name': 'Premium Sharbati Wheat Grains', 'category': 'grains', 'farmer_name': 'Punjab Grain Fields', 'price': 42, 'unit': 'kg', 'stock': 800, 'tag': 'Grade A Grain', 'icon': '🌾' },
            { 'name': 'Kolam Raw Rice', 'category': 'rice', 'farmer_name': 'Godavari Rice Mills', 'price': 65, 'unit': 'kg', 'stock': 600, 'tag': 'Fresh Harvest', 'icon': '🍚' },
            { 'name': 'Fresh Baby Spinach', 'category': 'vegetables', 'farmer_name': 'Green Acres Organic Farm', 'price': 40, 'unit': 'kg', 'stock': 180, 'tag': 'Hydroponic', 'icon': '🥬' },
            { 'name': 'Yellow Toor Dal (Lentils)', 'category': 'pulses', 'farmer_name': 'Vidarbha Agro', 'price': 140, 'unit': 'kg', 'stock': 250, 'tag': 'Unpolished', 'icon': '🫘' },
            { 'name': 'Nagpur Sweet Oranges', 'category': 'fruits', 'farmer_name': 'Sahyadri Orchards', 'price': 80, 'unit': 'kg', 'stock': 400, 'tag': 'Export Quality', 'icon': '🍊' },
            { 'name': 'Basmati Rice (1121 Steam)', 'category': 'rice', 'farmer_name': 'Golden Fields Ltd', 'price': 120, 'unit': 'kg', 'stock': 500, 'tag': 'Long Grain', 'icon': '🍚' }
        ]

        for item in produce_items:
            if not ProduceItem.objects.filter(name=item['name']).exists():
                ProduceItem.objects.create(**item)
                self.stdout.write(self.style.SUCCESS(f"Seeded produce: {item['name']}"))

        # Seed Agri-Inputs Catalog
        input_items = [
            { 'name': 'Neem Shield Organic Pesticide', 'category': 'pesticides', 'merchant_name': 'Kisan Agri Supplies', 'price': 450, 'unit': 'Liter', 'stock': 100, 'icon': '🧪', 'desc': 'Eco-friendly natural pest controller for leaf caterpillars and aphids.' },
            { 'name': 'VermiCompost Organic Manure', 'category': 'manure', 'merchant_name': 'Kisan Agri Supplies', 'price': 320, 'unit': '50kg Bag', 'stock': 80, 'icon': '🌱', 'desc': 'Rich humus fertilizer packed with earthworm castings for soil health.' },
            { 'name': 'Hybrid Bt-Cotton Seeds', 'category': 'seeds', 'merchant_name': 'Krishi Seva Kendra', 'price': 850, 'unit': 'Packet', 'stock': 150, 'icon': '🌾', 'desc': 'Bollworm resistant high yield cotton seed hybrid.' },
            { 'name': 'FungiStop Crop Medicine', 'category': 'medicines', 'merchant_name': 'Kisan Agri Supplies', 'price': 580, 'unit': '500ml', 'stock': 60, 'icon': '💊', 'desc': 'Systemic fungicide for powdery mildew and root rot treatment.' },
            { 'name': 'NPK 19:19:19 Soluble Fertilizer', 'category': 'manure', 'merchant_name': 'Kisan Agri Supplies', 'price': 1250, 'unit': '25kg Bag', 'stock': 90, 'icon': '🧪', 'desc': '100% water soluble plant nutrient booster for rapid crop growth.' }
        ]

        for item in input_items:
            if not AgriInput.objects.filter(name=item['name']).exists():
                AgriInput.objects.create(**item)
                self.stdout.write(self.style.SUCCESS(f"Seeded agri-input: {item['name']}"))

        self.stdout.write(self.style.SUCCESS("AgriSales database seeding completed successfully!"))
