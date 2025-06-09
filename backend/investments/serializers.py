from rest_framework import serializers
from .models import Fund, Transaction

class FundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fund
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    fund_name = serializers.CharField(source='fund.name', read_only=True)
    
    class Meta:
        model = Transaction
        fields = '__all__'