from django.urls import path
from . import views

urlpatterns = [
    # Template Page Routes
    path('', views.login_page, name='login'),
    path('signup/', views.signup_page, name='signup'),
    path('buyer-home/', views.buyer_home_page, name='buyer_home'),
    path('buyer-checkout/', views.buyer_checkout_page, name='buyer_checkout'),
    path('buyer-tracking/', views.buyer_tracking_page, name='buyer_tracking'),
    path('seller-home/', views.seller_home_page, name='seller_home'),
    path('farmer-sell/', views.farmer_sell_page, name='farmer_sell'),
    path('farmer-inputs/', views.farmer_inputs_page, name='farmer_inputs'),
    path('merchant-home/', views.merchant_home_page, name='merchant_home'),
    path('admin-home/', views.admin_home_page, name='admin_home'),

    # REST API Routes
    path('api/login/', views.api_login, name='api_login'),
    path('api/signup/', views.api_signup, name='api_signup'),
    path('api/produce/', views.api_produce_list, name='api_produce'),
    path('api/inputs/', views.api_inputs_list, name='api_inputs'),
    path('api/orders/create/', views.api_create_order, name='api_create_order'),
    path('api/orders/<str:order_id>/', views.api_get_order, name='api_get_order'),
    path('api/admin/users/', views.api_admin_users, name='api_admin_users'),
    path('api/admin/users/<str:email>/delete/', views.api_admin_delete_user, name='api_admin_delete_user'),
]
