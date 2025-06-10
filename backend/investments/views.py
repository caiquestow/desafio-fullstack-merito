from rest_framework import viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.db.models import Sum
from .models import Fund, Transaction
from .serializers import FundSerializer, TransactionSerializer


class FundViewSet(viewsets.ModelViewSet):
    queryset = Fund.objects.all()
    serializer_class = FundSerializer
    
    @action(detail=True, methods=['get'])
    def balance(self, request, pk=None):
        """Retorna saldo específico de um fundo"""
        fund = self.get_object()
        
        deposits = Transaction.objects.filter(
            fund=fund,
            transaction_type='DEPOSIT'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        withdrawals = Transaction.objects.filter(
            fund=fund,
            transaction_type='WITHDRAWAL'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        balance = deposits - withdrawals
        shares = fund.get_fund_shares()
        
        return Response({
            'fund_id': fund.id,
            'fund_name': fund.name,
            'fund_ticker': fund.ticker,
            'balance': balance,
            'shares': float(shares),
            'share_price': float(fund.share_price),
            'total_deposits': deposits,
            'total_withdrawals': withdrawals
        })


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    
    def get_queryset(self):
        """Permitir filtrar por fundo"""
        queryset = Transaction.objects.all()
        fund_id = self.request.query_params.get('fund', None)
        if fund_id is not None:
            queryset = queryset.filter(fund=fund_id)
        return queryset


# Calcula o saldo atual da carteira (todos os fundos)
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
    
    # Buscar saldo por fundo
    funds_balance = []
    for fund in Fund.objects.all():
        fund_balance = fund.get_fund_balance()
        fund_shares = fund.get_fund_shares()
        
        if fund_balance > 0 or fund_shares > 0:  # Só mostrar fundos com saldo
            funds_balance.append({
                'fund_id': fund.id,
                'fund_name': fund.name,
                'fund_ticker': fund.ticker,
                'balance': float(fund_balance),
                'shares': float(fund_shares),
                'share_price': float(fund.share_price)
            })
    
    return Response({
        'balance': balance,
        'total_deposits': deposits,
        'total_withdrawals': withdrawals,
        'funds_balance': funds_balance
    })