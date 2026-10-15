from django.test import TestCase, Client
from django.contrib.auth.models import User
from agrisales_app.models import UserProfile, ProduceItem, AgriInput, Order, OrderItem
import json

class AgriSalesBackendTests(TestCase):
    def setUp(self):
        self.client = Client()
        
        # Create Test Admin
        self.admin_user = User.objects.create_user(username='admin_test', email='admin@agrisales.com', password='Admin@1234')
        UserProfile.objects.create(user=self.admin_user, role='admin', admin_key='ADMIN-2026-KEY')

        # Create Test Buyer
        self.buyer_user = User.objects.create_user(username='buyer_test', email='buyer@freshmarket.com', password='Buyer@1234')
        UserProfile.objects.create(user=self.buyer_user, role='buyer', phone='+91 98765-43210', business_name='Fresh Market')

        # Create Test Farmer
        self.farmer_user = User.objects.create_user(username='farmer_test', email='farmer@greenacres.com', password='Farmer@1234')
        UserProfile.objects.create(user=self.farmer_user, role='seller', phone='+91 94221-88900', farm_name='Green Acres Organic')

        # Create Test Produce Item
        self.produce = ProduceItem.objects.create(
            name='Test Apples',
            category='fruits',
            farmer_name='Green Acres Organic',
            price=150.00,
            unit='kg',
            stock=100,
            tag='Organic'
        )

        # Create Test Agri Input
        self.input_item = AgriInput.objects.create(
            name='Test Pesticide',
            category='pesticides',
            merchant_name='Kisan Supplies',
            price=300.00,
            unit='Liter',
            stock=50,
            desc='Test pesticide description'
        )

    def test_login_api_success(self):
        response = self.client.post(
            '/api/login/',
            data=json.dumps({'email': 'buyer@freshmarket.com', 'password': 'Buyer@1234', 'role': 'buyer'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        res_data = response.json()
        self.assertEqual(res_data['status'], 'success')
        self.assertEqual(res_data['user']['email'], 'buyer@freshmarket.com')

    def test_login_api_invalid_role(self):
        response = self.client.post(
            '/api/login/',
            data=json.dumps({'email': 'buyer@freshmarket.com', 'password': 'Buyer@1234', 'role': 'seller'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        res_data = response.json()
        self.assertEqual(res_data['status'], 'error')

    def test_signup_api(self):
        response = self.client.post(
            '/api/signup/',
            data=json.dumps({
                'email': 'newbuyer@agrisales.com',
                'password': 'NewBuyer@1234',
                'name': 'New Buyer',
                'role': 'buyer',
                'phone': '+91 99999-88888',
                'businessName': 'New Buyer Market'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(User.objects.filter(email='newbuyer@agrisales.com').exists())

    def test_produce_catalog_api(self):
        response = self.client.get('/api/produce/')
        self.assertEqual(response.status_code, 200)
        res_data = response.json()
        self.assertEqual(res_data['status'], 'success')
        self.assertGreaterEqual(len(res_data['catalog']), 1)

    def test_create_order_and_stock_deduction(self):
        order_payload = {
            'id': 'AGRI-TEST-001',
            'buyerName': 'Alex Johnson',
            'buyerPhone': '+91 98765-43210',
            'deliveryAddress': 'APMC Mandi, Vashi',
            'paymentMethod': 'UPI',
            'subtotal': 3000.00,
            'tax': 150.00,
            'totalAmount': 3150.00,
            'status': 'Confirmed',
            'farmerName': 'Green Acres Organic',
            'items': [
                {'id': self.produce.id, 'name': self.produce.name, 'price': 150.00, 'qty': 20}
            ]
        }

        response = self.client.post(
            '/api/orders/create/',
            data=json.dumps(order_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['orderId'], 'AGRI-TEST-001')

        # Verify stock deducted in DB
        self.produce.refresh_from_db()
        self.assertEqual(self.produce.stock, 80) # 100 - 20 = 80
