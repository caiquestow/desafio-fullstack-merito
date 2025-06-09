from django.db import models
from django.core.exceptions import ValidationError
from django.db.models import Sum
from decimal import Decimal



class Fund(models.Model):
    FUND_TYPES = [
        ('STOCK', 'Stock Fund'),
        ('BOND', 'Bond Fund'),
        ('MULTI', 'Multi Market'),
    ]
    
    name = models.CharField(max_length=100)
    ticker = models.CharField(max_length=10, unique=True)
    fund_type = models.CharField(max_length=10, choices=FUND_TYPES)
    share_price = models.DecimalField(max_digits=10, decimal_places=4)
    
    def __str__(self):
        return f"{self.ticker} - {self.name}"

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('DEPOSIT', 'Deposit'),
        ('WITHDRAWAL', 'Withdrawal'),
    ]
    
    fund = models.ForeignKey(Fund, on_delete=models.CASCADE)
    date = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    shares_quantity = models.DecimalField(max_digits=12, decimal_places=4, blank=True)
    
    class Meta:
        ordering = ['-date']
    
    def save(self, *args, **kwargs):
        # Calcular quantidade de cotas automaticamente
        if self.fund and self.amount:
            self.shares_quantity = self.amount / self.fund.share_price
            
        # Para resgates, tornar quantidade negativa
        if self.transaction_type == 'WITHDRAWAL' and self.shares_quantity > 0:
            self.shares_quantity = -self.shares_quantity
            
        super().save(*args, **kwargs)

    @classmethod
    def get_wallet_balance(cls):
        """Calcula saldo atual da carteira"""
        deposits = cls.objects.filter(
            transaction_type='DEPOSIT'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
        
        withdrawals = cls.objects.filter(
            transaction_type='WITHDRAWAL'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
        
        return deposits - withdrawals