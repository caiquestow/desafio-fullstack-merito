from django.db import models
from django.core.exceptions import ValidationError

from django.db.models import Sum


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
    shares_quantity = models.DecimalField(max_digits=12, decimal_places=4)
    
    class Meta:
        ordering = ['-date']

    def clean(self):
        """Validações customizadas antes de salvar"""
        if self.transaction_type == 'WITHDRAWAL':
            # Calcula saldo atual antes desta transação
            current_balance = self.get_wallet_balance()
            if self.amount > current_balance:
                raise ValidationError("Saldo insuficiente para saque.")
            
    def get_wallet_balance(self):
        """Calcula saldo atual da carteira"""
        deposits = Transaction.objects.filter(
            transaction_type='DEPOSIT'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        withdrawals = Transaction.objects.filter(
            transaction_type='WITHDRAWAL'
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        return deposits - withdrawals
    
    def save(self, *args, **kwargs):
        """Sobrescreve save para chamar clean()"""
        self.clean()  # Chama as validações
        super().save(*args, **kwargs)