from django.db import models

class Fund(models.Model):
    FUND_TYPES = [
        ('STOCK', 'Stock Fund'),
        ('BOND', 'Bond Fund'),
        ('MULTI', 'Multi Market'),
    ]
    
    name = models.CharField(max_length=100)
    ticker = models.CharField(max_length=10, unique=True)  # código -> ticker
    fund_type = models.CharField(max_length=10, choices=FUND_TYPES)
    share_price = models.DecimalField(max_digits=10, decimal_places=4)  # valor_cota → share_price
    
    def __str__(self):
        return f"{self.ticker} - {self.name}"

class Transaction(models.Model):  # Movimentacao → Transaction
    TRANSACTION_TYPES = [
        ('DEPOSIT', 'Deposit'),    # APORTE → DEPOSIT
        ('WITHDRAWAL', 'Withdrawal'),  # RESGATE → WITHDRAWAL
    ]
    
    fund = models.ForeignKey(Fund, on_delete=models.CASCADE)
    date = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)  # valor → amount
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)  # tipo → transaction_type
    shares_quantity = models.DecimalField(max_digits=12, decimal_places=4)  # quantidade_cotas → shares_quantity
    
    class Meta:
        ordering = ['-date']