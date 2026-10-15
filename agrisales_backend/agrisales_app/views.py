import json
import random
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from .models import UserProfile, ProduceItem, AgriInput, Order, OrderItem

# HTML Template Views
def login_page(request):
    return render(request, 'index.html')

def signup_page(request):
    return render(request, 'signup.html')

def buyer_home_page(request):
    return render(request, 'buyer_home.html')

def buyer_checkout_page(request):
    return render(request, 'buyer_checkout.html')

def buyer_tracking_page(request):
    return render(request, 'buyer_tracking.html')

def seller_home_page(request):
    return render(request, 'seller_home.html')

def farmer_sell_page(request):
    return render(request, 'farmer_sell.html')

def farmer_inputs_page(request):
    return render(request, 'farmer_inputs.html')

def merchant_home_page(request):
    return render(request, 'merchant_home.html')

def admin_home_page(request):
    return render(request, 'admin_home.html')


# JSON REST APIs
@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email', '').strip()
            password = data.get('password', '')
            role = data.get('role', 'buyer')

            try:
                user_obj = User.objects.get(email__iexact=email)
                username = user_obj.username
            except User.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': f'Invalid credentials for {role.upper()} role.'}, status=400)

            user = authenticate(username=username, password=password)

            if user is not None:
                profile = getattr(user, 'profile', None)
                if profile and profile.role == role:
                    login(request, user)
                    return JsonResponse({
                        'status': 'success',
                        'user': {
                            'name': user.first_name or user.username,
                            'email': user.email,
                            'role': profile.role,
                            'phone': profile.phone,
                            'farmName': profile.farm_name,
                            'storeName': profile.store_name,
                            'businessName': profile.business_name,
                            'department': profile.department
                        }
                    })
                else:
                    return JsonResponse({'status': 'error', 'message': f'Role mismatch. User is registered as {profile.get_role_display() if profile else "Unknown"}'}, status=400)
            else:
                return JsonResponse({'status': 'error', 'message': f'Invalid credentials for {role.upper()} role.'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid HTTP Method'}, status=405)


@csrf_exempt
def api_signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email', '').strip()
            password = data.get('password', '')
            name = data.get('name', '').strip()
            role = data.get('role', 'buyer')
            phone = data.get('phone', '').strip()

            if User.objects.filter(email__iexact=email).exists():
                return JsonResponse({'status': 'error', 'message': 'Email address already registered.'}, status=400)

            username = email.split('@')[0] + "_" + str(random.randint(100, 999))
            user = User.objects.create_user(username=username, email=email, password=password, first_name=name)

            profile = UserProfile.objects.create(
                user=user,
                role=role,
                phone=phone,
                farm_name=data.get('farmName', ''),
                farm_region=data.get('farmRegion', ''),
                business_name=data.get('businessName', ''),
                business_type=data.get('businessType', ''),
                delivery_address=data.get('address', ''),
                store_name=data.get('storeName', ''),
                license_id=data.get('licenseId', ''),
                department=data.get('department', '')
            )

            return JsonResponse({'status': 'success', 'message': 'User registered successfully!'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid HTTP Method'}, status=405)


@csrf_exempt
def api_produce_list(request):
    if request.method == 'GET':
        items = ProduceItem.objects.filter(is_active=True).order_by('-id')
        data = [{
            'id': item.id,
            'name': item.name,
            'category': item.category,
            'farmer': item.farmer_name,
            'price': float(item.price),
            'unit': item.unit,
            'stock': item.stock,
            'tag': item.tag,
            'icon': item.icon
        } for item in items]
        return JsonResponse({'status': 'success', 'catalog': data})
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            item = ProduceItem.objects.create(
                name=data.get('name'),
                category=data.get('category', 'vegetables'),
                farmer_name=data.get('farmer', 'Certified Farmer'),
                price=data.get('price', 0),
                unit=data.get('unit', 'kg'),
                stock=data.get('stock', 500),
                tag=data.get('tag', 'Fresh Harvest'),
                icon=data.get('icon', '🌾')
            )
            return JsonResponse({'status': 'success', 'message': 'Produce item published successfully!', 'id': item.id})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
def api_inputs_list(request):
    if request.method == 'GET':
        items = AgriInput.objects.all().order_by('-id')
        data = [{
            'id': item.id,
            'name': item.name,
            'category': item.category,
            'merchant': item.merchant_name,
            'price': float(item.price),
            'unit': item.unit,
            'stock': item.stock,
            'desc': item.desc,
            'icon': item.icon
        } for item in items]
        return JsonResponse({'status': 'success', 'catalog': data})
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            item = AgriInput.objects.create(
                name=data.get('name'),
                category=data.get('category', 'pesticides'),
                merchant_name=data.get('merchant', 'Kisan Agri Supplies'),
                price=data.get('price', 0),
                unit=data.get('unit', 'Liter'),
                stock=data.get('stock', 100),
                desc=data.get('desc', ''),
                icon=data.get('icon', '🧪')
            )
            return JsonResponse({'status': 'success', 'message': 'Agri input listed successfully!', 'id': item.id})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
def api_create_order(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            order_number = data.get('id', f"AGRI-{random.randint(100000, 999999)}")
            
            with transaction.atomic():
                order = Order.objects.create(
                    order_number=order_number,
                    buyer_name=data.get('buyerName', 'Alex Johnson'),
                    buyer_phone=data.get('buyerPhone', '+91 98765-43210'),
                    delivery_address=data.get('deliveryAddress', 'APMC Market, Vashi'),
                    payment_method=data.get('paymentMethod', 'UPI'),
                    subtotal=data.get('subtotal', 0),
                    tax=data.get('tax', 0),
                    total_amount=data.get('totalAmount', 0),
                    status=data.get('status', 'Confirmed'),
                    farmer_name=data.get('farmerName', 'Green Acres Organic Farm'),
                    estimated_delivery=data.get('estimatedDelivery', 'Tomorrow by 2:00 PM')
                )

                # Process order items and deduct stock!
                for item_data in data.get('items', []):
                    qty = item_data.get('qty', 1)
                    item_id = item_data.get('id')
                    
                    # Deduct from ProduceItem if exists
                    prod_item = ProduceItem.objects.filter(id=item_id).first()
                    if prod_item:
                        prod_item.stock = max(0, prod_item.stock - qty)
                        if prod_item.stock == 0:
                            prod_item.tag = "Out of Stock"
                        prod_item.save()

                    # Deduct from AgriInput if exists
                    input_item = AgriInput.objects.filter(id=item_id).first()
                    if input_item:
                        input_item.stock = max(0, input_item.stock - qty)
                        input_item.save()

                    OrderItem.objects.create(
                        order=order,
                        produce_item=prod_item,
                        input_item=input_item,
                        item_name=item_data.get('name', 'Produce Item'),
                        quantity=qty,
                        unit_price=item_data.get('price', 0),
                        total_price=item_data.get('price', 0) * qty
                    )

            return JsonResponse({'status': 'success', 'orderId': order.order_number})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@csrf_exempt
def api_get_order(request, order_id):
    order = Order.objects.filter(order_number=order_id).first()
    if not order:
        return JsonResponse({'status': 'error', 'message': 'Order not found'}, status=404)
    
    items = [{
        'name': item.item_name,
        'qty': item.quantity,
        'price': float(item.unit_price),
        'total': float(item.total_price)
    } for item in order.items.all()]

    return JsonResponse({
        'status': 'success',
        'order': {
            'id': order.order_number,
            'buyerName': order.buyer_name,
            'buyerPhone': order.buyer_phone,
            'deliveryAddress': order.delivery_address,
            'paymentMethod': order.payment_method,
            'subtotal': float(order.subtotal),
            'tax': float(order.tax),
            'totalAmount': float(order.total_amount),
            'status': order.status,
            'farmerName': order.farmer_name,
            'estimatedDelivery': order.estimated_delivery,
            'created_at': order.created_at.strftime("%Y-%m-%d %H:%M"),
            'items': items
        }
    })


# Admin CRUD APIs
@csrf_exempt
def api_admin_users(request):
    if request.method == 'GET':
        users = User.objects.select_related('profile').all().order_by('-id')
        data = []
        for u in users:
            p = getattr(u, 'profile', None)
            data.append({
                'id': u.id,
                'name': u.first_name or u.username,
                'email': u.email,
                'role': p.role if p else 'buyer',
                'phone': p.phone if p else '',
                'farmName': p.farm_name if p else '',
                'storeName': p.store_name if p else '',
                'businessName': p.business_name if p else '',
                'department': p.department if p else ''
            })
        return JsonResponse({'status': 'success', 'users': data})


@csrf_exempt
def api_admin_delete_user(request, email):
    if request.method == 'POST':
        user = User.objects.filter(email__iexact=email).first()
        if user:
            user.delete()
            return JsonResponse({'status': 'success', 'message': f'User {email} deleted successfully.'})
        return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)
