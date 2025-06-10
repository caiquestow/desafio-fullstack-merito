from rest_framework import serializers
from .models import Fund, Transaction
from django.db.models import Sum


class FundSerializer(serializers.ModelSerializer):
    current_balance = serializers.SerializerMethodField()
    current_shares = serializers.SerializerMethodField()
    
    class Meta:
        model = Fund
        fields = ['id', 'name', 'ticker', 'fund_type', 'share_price', 
                 'current_balance', 'current_shares']
    
    def get_current_balance(self, obj):
        """Retorna saldo atual do fundo"""
        return float(obj.get_fund_balance())
    
    def get_current_shares(self, obj):
        """Retorna quantidade de cotas do fundo"""
        return float(obj.get_fund_shares())


class TransactionSerializer(serializers.ModelSerializer):
    fund_name = serializers.CharField(source='fund.name', read_only=True)
    fund_ticker = serializers.CharField(source='fund.ticker', read_only=True)

    class Meta:
        model = Transaction
        fields = ['id', 'fund', 'fund_name', 'fund_ticker', 'date', 'amount', 
                 'transaction_type', 'shares_quantity']
        read_only_fields = ['shares_quantity']  # Será calculado automaticamente

    def validate(self, data):
        """Validação customizada para resgates"""
        if data.get('transaction_type') == 'WITHDRAWAL':
            fund = data.get('fund')
            amount = data.get('amount')
            
            if fund and amount:
                # Verificar saldo específico do fundo
                current_fund_balance = fund.get_fund_balance()
                
                if amount > current_fund_balance:
                    raise serializers.ValidationError(
                        f"Saldo insuficiente no fundo {fund.ticker}. "
                        f"Saldo disponível: R$ {current_fund_balance:.2f}"
                    )
        
        return data

    def to_representation(self, instance):
        """Personalizar saída da API"""
        data = super().to_representation(instance)
        
        # Mostrar quantidade de cotas sempre positiva na visualização
        if data['shares_quantity']:
            data['shares_quantity'] = abs(float(data['shares_quantity']))
            
        return data