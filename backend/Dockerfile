# Dockerfile para o Backend Django
FROM python:3.12-slim

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências básicas do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements
COPY requirements.txt .

# Instalar dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY . .

# Criar diretórios necessários
RUN mkdir -p /app/staticfiles /app/db

# Expor porta
EXPOSE 8000

# Comando para executar migrações e iniciar servidor
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]