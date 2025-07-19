# Backend - Loja de Brinquedos

API REST desenvolvida em Node.js com TypeScript para gerenciamento de clientes e vendas.

## 🏗️ Arquitetura

- **Framework**: Express.js
- **Linguagem**: TypeScript
- **Banco de Dados**: SQLite
- **Autenticação**: JWT
- **Validação**: Express-validator
- **Testes**: Jest + Supertest

## 📁 Estrutura

```
src/
├── config/          # Configurações (banco, env)
├── controllers/     # Controladores das rotas
├── middleware/      # Middlewares (auth, validação)
├── routes/          # Definição das rotas
├── services/        # Lógica de negócio
├── types/           # Interfaces TypeScript
└── __tests__/       # Testes automatizados
```

## 🚀 Como Executar

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

### Testes
```bash
npm test
npm run test:coverage
```

## 📊 Endpoints

### Autenticação
- `POST /auth/login` - Login do usuário

### Clientes
- `GET /clients` - Listar clientes (com filtros)
- `POST /clients` - Criar cliente
- `PUT /clients/:id` - Atualizar cliente
- `DELETE /clients/:id` - Excluir cliente

### Vendas
- `GET /sales/stats` - Estatísticas diárias
- `GET /sales/top-clients` - Top clientes
- `GET /sales` - Listar vendas
- `POST /sales` - Criar venda

## 🔐 Autenticação

Todas as rotas (exceto login) requerem autenticação via JWT.

**Credenciais padrão:**
- Email: `admin@loja.com`
- Senha: `admin123`

## 🧪 Testes

O projeto inclui testes automatizados para:
- Autenticação
- CRUD de clientes
- Validações
- Middlewares

Para executar os testes:
```bash
npm test
```

## 📝 Formato de Resposta

### Sucesso
```json
{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso"
}
```

### Erro
```json
{
  "success": false,
  "error": "Mensagem de erro",
  "details": [ ... ]
}
```

## 🔧 Configuração

Variáveis de ambiente (`.env`):
```env
PORT=3001
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## 📊 Banco de Dados

O SQLite é inicializado automaticamente com:
- Tabela `users` (autenticação)
- Tabela `clients` (clientes)
- Tabela `sales` (vendas)
- Dados de exemplo

O arquivo do banco é criado em `database.sqlite`. 