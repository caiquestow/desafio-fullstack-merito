from django.db import models
from django.core.exceptions import ValidationError
from django.db.models import Sum
from decimal import Decimal


class Fund(models.Model):
    FUND_TYPES = [
        ('STOCK', 'Fundo de Ações'),
        ('BOND', 'Fundo de Renda Fixa'),
        ('MULTI', 'Fundo Multimercado'),
    ]
    
    name = models.CharField(max_length=100)
    ticker = models.CharField(max_length=10, unique=True)
    fund_type = models.CharField(max_length=10, choices=FUND_TYPES)
    share_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def get_fund_balance(self):
        """Calcula saldo atual deste fundo específico"""
        deposits = Transaction.objects.filter(
            fund=self,
            transaction_type='DEPOSIT'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
        
        withdrawals = Transaction.objects.filter(
            fund=self,
            transaction_type='WITHDRAWAL'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
        
        return deposits - withdrawals
    
    def get_fund_shares(self):
        """Calcula quantidade total de cotas deste fundo"""
        deposits_shares = Transaction.objects.filter(
            fund=self,
            transaction_type='DEPOSIT'
        ).aggregate(total=Sum('shares_quantity'))['total'] or Decimal('0')
        
        withdrawals_shares = Transaction.objects.filter(
            fund=self,
            transaction_type='WITHDRAWAL'
        ).aggregate(total=Sum('shares_quantity'))['total'] or Decimal('0')
        
        # withdrawals_shares já são negativos, então somamos
        return deposits_shares + withdrawals_shares
    
    def __str__(self):
        return f"{self.ticker} - {self.name}"


class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('DEPOSIT', 'Aporte'),
        ('WITHDRAWAL', 'Resgate'),
    ]
    
    fund = models.ForeignKey(Fund, on_delete=models.CASCADE)
    date = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    shares_quantity = models.DecimalField(max_digits=12, decimal_places=2, blank=True)
    
    class Meta:
        ordering = ['-date']
    
    def clean(self):
        """Validação customizada antes de salvar"""
        if self.transaction_type == 'WITHDRAWAL' and self.fund and self.amount:
            # Verificar se há saldo suficiente no fundo específico
            current_fund_balance = self.fund.get_fund_balance()
            
            if self.amount > current_fund_balance:
                raise ValidationError(
                    f"Saldo insuficiente no fundo {self.fund.ticker}. "
                    f"Saldo disponível: R$ {current_fund_balance:.2f}"
                )
    
    def save(self, *args, **kwargs):
        # Validar antes de salvar
        self.clean()
        
        # Calcular quantidade de cotas automaticamente
        if self.fund and self.amount:
            self.shares_quantity = self.amount / self.fund.share_price
            
        # Para resgates, tornar quantidade negativa
        if self.transaction_type == 'WITHDRAWAL' and self.shares_quantity > 0:
            self.shares_quantity = -self.shares_quantity
            
        super().save(*args, **kwargs)

    @classmethod
    def get_wallet_balance(cls):
        """Calcula saldo atual da carteira (todos os fundos)"""
        deposits = cls.objects.filter(
            transaction_type='DEPOSIT'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
        
        withdrawals = cls.objects.filter(
            transaction_type='WITHDRAWAL'
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
        
        return deposits - withdrawals