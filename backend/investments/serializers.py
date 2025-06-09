from rest_framework import serializers
from .models import Fund, Transaction

from django.db.models import Sum

class FundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fund
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    fund_name = serializers.CharField(source='fund.name', read_only=True)
    
    def validate(self, data):
        if data['transaction_type'] == 'WITHDRAWAL':
            # Calcula saldo atual
            current_balance = self.get_current_balance()
            if data['amount'] > current_balance:
                raise serializers.ValidationError("Saldo insuficiente para resgate")
        return data
    
    def get_current_balance(self):
        deposits = Transaction.objects.filter(
            transaction_type='DEPOSIT'
        ).aggregate(Sum('amount'))['total'] or 0
        
        withdrawals = Transaction.objects.filter(
            transaction_type='WITHDRAWAL'  
        ).aggregate(Sum('amount'))['total'] or 0
        
        return deposits - withdrawals
    
    class Meta:
        model = Transaction
        fields = '__all__'