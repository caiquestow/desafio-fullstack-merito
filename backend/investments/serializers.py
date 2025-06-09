from rest_framework import serializers
from .models import Fund, Transaction

from django.db.models import Sum

class FundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fund
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    fund_name = serializers.CharField(source='fund.name', read_only=True)
    fund_ticker = serializers.CharField(source='fund.ticker', read_only=True)

    class Meta:
        model = Transaction
        fields = ['id', 'fund', 'fund_name', 'fund_ticker', 'date', 'amount', 
            'transaction_type', 'shares_quantity']
        read_only_fields = ['shares_quantity']  # Será calculado automaticamente
        fields = '__all__'

    def validate(self, data):
        """Validação customizada para resgates"""
        if data.get('transaction_type') == 'WITHDRAWAL':
            # Calcular saldo atual
            current_balance = Transaction.get_wallet_balance()
            
            # Verificar se há saldo suficiente
            if data['amount'] > current_balance:
                raise serializers.ValidationError(
                    f"Saldo insuficiente. Saldo atual: R$ {current_balance:.2f}"
                )
        
        return data

    def to_representation(self, instance):
        """Personalizar saída da API"""
        data = super().to_representation(instance)
        
        # Mostrar quantidade de cotas sempre positiva na visualização
        if data['shares_quantity']:
            data['shares_quantity'] = abs(float(data['shares_quantity']))
            
        return data