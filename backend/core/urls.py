from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('investments.urls')), # Apontamento para o modulo de investimentos
]