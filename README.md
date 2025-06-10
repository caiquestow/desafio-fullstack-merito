# Dashboard de Investimentos - Desafio FullStack

Sistema para gestão de carteira de investimentos com registro de movimentações e controle de saldo.

## 🚀 Tecnologias

- **Backend**: Django + DRF (API REST)
- **Frontend**: React.js + Bootstrap
- **Banco**: SQLite
- **Container**: Docker

## 🗂️ Estrutura

```
projeto/
├── backend/
│   ├── investments/     # App principal
│   ├── core/           # Settings Django
│   └── Dockerfile      # Container
├── frontend/
│   ├── src/components/ # Componentes React
│   └── src/services/   # API calls
└── docker-compose.yml  # Orquestração
```

## ⚡ Quick Start

### 1. Backend (Docker)
```bash
git clone https://github.com/caiquestow/desafio-fullstack-merito
cd desafio-fullstack-merito
docker-compose up --build
```
✅ Backend rodando em: http://localhost:8000

### 2. Frontend
```bash
cd frontend
npm install
npm start
```
✅ Frontend rodando em: http://localhost:3000

## 🎯 Funcionalidades Implementadas

### Core Business
- ✅ **Cadastro de Fundos** - 12 fundos pré-carregados
- ✅ **Aportes e Resgates** - Transações com validação
- ✅ **Controle de Saldo** - Validação de saldo insuficiente
- ✅ **Cálculo Automático** - Quantidade de cotas baseada no valor

## 🔌 Principais Endpoints

```bash
# Saldo da carteira
GET /api/wallet/balance/

# Listar fundos disponíveis
GET /api/funds/

# Fazer transação
POST /api/transactions/
{
  "fund": 1,
  "transaction_type": "DEPOSIT", // ou "WITHDRAWAL"
  "amount": 1000.00,
  "date": "2024-06-10"
}

# Histórico de transações
GET /api/transactions/
```
