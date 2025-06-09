# Desafio FullStack Mérito - Dashboard de Investimento

Sistema para cadastrar fundos de investimento, registrar movimentações e controlar saldo da carteira.

## 🚀 Tecnologias Utilizadas

- **Backend**: Django + Django REST Framework
- **Frontend**: React.js
- **Banco de Dados**: SQLite
- **Containerização**: Docker (backend)

## 📋 Funcionalidades

- ✅ Cadastro de fundos de investimento (nome, código, tipo, valor da cota)
- ✅ Registro de movimentações (aportes e resgates)
- ✅ Controle de saldo da carteira
- ✅ Validação de saldo insuficiente
- ✅ Visualização de movimentações ordenadas por data
- ✅ Interface React consumindo API REST

## 🐳 Como rodar o Backend (Docker)

### Pré-requisitos
- Docker
- Docker Compose

### Passos
```bash
# 1. Clone o repositório
git clone <seu-repositorio>
cd desafio-fullstack-merito

# 2. Subir o backend com Docker
docker-compose up --build

# 3. Criar superuser (opcional, em outro terminal)
docker-compose exec backend python manage.py createsuperuser
```

O backend estará disponível em: http://localhost:8000

## ⚛️ Como rodar o Frontend (Local)

### Pré-requisitos
- Node.js (versão 16+)
- npm ou yarn

### Passos
```bash
# 1. Navegar para a pasta do frontend
cd frontend

# 2. Instalar dependências
npm install

# 3. Iniciar o servidor de desenvolvimento
npm start
```

O frontend estará disponível em: http://localhost:3000

## 🔌 APIs Disponíveis

### Fundos
- `GET /api/funds/` - Listar todos os fundos
- `POST /api/funds/` - Criar novo fundo
- `GET /api/funds/{id}/` - Detalhes de um fundo
- `PUT /api/funds/{id}/` - Atualizar fundo
- `DELETE /api/funds/{id}/` - Deletar fundo

#### Exemplo de criação de fundo:
```json
POST /api/funds/
{
  "nome": "Fundo XYZ",
  "codigo": "XYZ11",
  "tipo": "FII",
  "valor_cota": 100.50
}
```

### Transações
- `GET /api/transactions/` - Listar todas as transações
- `POST /api/transactions/` - Criar nova transação
- `GET /api/transactions/{id}/` - Detalhes de uma transação

#### Exemplo de transação (aporte):
```json
POST /api/transactions/
{
  "fund": 1,
  "tipo": "aporte",
  "valor": 1000.00,
  "data": "2024-06-09"
}
```

#### Exemplo de transação (resgate):
```json
POST /api/transactions/
{
  "fund": 1,
  "tipo": "resgate",
  "valor": 500.00,
  "data": "2024-06-09"
}
```

## 🧪 Como testar as APIs

### Via curl:
```bash
# Listar fundos
curl -X GET http://localhost:8000/api/funds/

# Criar fundo
curl -X POST http://localhost:8000/api/funds/ \
  -H "Content-Type: application/json" \
  -d '{"nome": "Teste", "codigo": "TEST11", "tipo": "FII", "valor_cota": 100.00}'

# Listar transações
curl -X GET http://localhost:8000/api/transactions/

# Fazer aporte
curl -X POST http://localhost:8000/api/transactions/ \
  -H "Content-Type: application/json" \
  -d '{"fund": 1, "tipo": "aporte", "valor": 1000.00, "data": "2024-06-09"}'
```

### Via Postman:
1. Importe a collection (se disponível)
2. Configure base URL: http://localhost:8000
3. Teste os endpoints listados acima

## 🗂️ Estrutura do Projeto

```
desafio-fullstack-merito/
├── backend/
│   ├── investments/          # App principal
│   │   ├── models.py        # Modelos (Fund, Transaction)
│   │   ├── serializers.py   # Serializers DRF
│   │   ├── views.py         # ViewSets da API
│   │   └── urls.py          # URLs da API
│   ├── backend/             # Configurações Django
│   ├── db/                  # Banco SQLite
│   ├── Dockerfile           # Container do backend
│   └── requirements.txt     # Dependências Python
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── services/        # Chamadas para API
│   │   └── App.js           # Componente principal
│   └── package.json         # Dependências Node
├── docker-compose.yml       # Orquestração Docker
└── README.md               # Este arquivo
```

## 🔧 Comandos Úteis

### Docker:
```bash
# Ver logs do backend
docker-compose logs -f backend

# Executar comando no container
docker-compose exec backend python manage.py shell

# Parar containers
docker-compose down

# Reconstruir imagem
docker-compose build backend
```

### Django (dentro do container):
```bash
# Migrations
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate

# Shell Django
docker-compose exec backend python manage.py shell

# Criar superuser
docker-compose exec backend python manage.py createsuperuser
```

## 🚨 Validações Implementadas

- ✅ Saldo insuficiente para resgates
- ✅ Valores negativos não permitidos
- ✅ Campos obrigatórios
- ✅ Tipos de transação válidos (aporte/resgate)

## 🧪 Testes

Para rodar os testes do backend:
```bash
docker-compose exec backend python manage.py test
```

## 📝 Observações

- O frontend consome a API REST do backend
- Dados são persistidos em SQLite através de volume Docker
- CORS configurado para desenvolvimento
- Não há autenticação implementada (conforme especificação)
- Interface funcional, foco na lógica de negócios

## 🛠️ Melhorias Futuras

- [ ] Testes automatizados mais abrangentes
- [ ] Interface mais elaborada
- [ ] Integração com APIs externas de cotações
- [ ] Sistema de autenticação
- [ ] Deploy automatizado

## 📞 Suporte

Em caso de dúvidas ou problemas:
1. Verifique se o Docker está rodando
2. Confirme que as portas 8000 e 3000 estão livres
3. Veja os logs: `docker-compose logs -f`