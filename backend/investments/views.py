from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum
from .models import Fund, Transaction
from .serializers import FundSerializer, TransactionSerializer

class FundViewSet(viewsets.ModelViewSet):
    queryset = Fund.objects.all()
    serializer_class = FundSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

# Calcula o saldo atual da carteira
@api_view(['GET'])
def wallet_balance(request):
    # Soma todos os aportes
    deposits = Transaction.objects.filter(transaction_type='DEPOSIT').aggregate(
        total=Sum('amount')
    )['total'] or 0
    
    withdrawals = Transaction.objects.filter(transaction_type='WITHDRAWAL').aggregate(
        total=Sum('amount')
    )['total'] or 0
    
    balance = deposits - withdrawals
    
    return Response({
        'balance': balance,
        'total_deposits': deposits,
        'total_withdrawals': withdrawals
    })