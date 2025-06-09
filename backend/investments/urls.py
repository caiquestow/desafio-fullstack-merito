from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'funds', views.FundViewSet)
router.register(r'transactions', views.TransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('wallet/balance/', views.wallet_balance, name='wallet-balance'),
]