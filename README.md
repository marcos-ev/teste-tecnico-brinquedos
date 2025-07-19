# 🎮 Sistema de Loja de Brinquedos

Sistema completo de gestão de loja de brinquedos com backend Node.js e frontend React, desenvolvido como teste técnico.

## 🚀 Funcionalidades

### Backend (API REST)
- ✅ **Autenticação JWT** com login/logout
- ✅ **CRUD completo de clientes** com filtros e busca
- ✅ **Sistema de vendas** com estatísticas
- ✅ **Banco de dados SQLite** com dados de exemplo
- ✅ **Validação de dados** com express-validator
- ✅ **Testes automatizados** com Jest + Supertest

### Frontend (React + TypeScript)
- ✅ **Interface moderna** com Material-UI
- ✅ **Dashboard** com gráficos e estatísticas
- ✅ **Gestão de clientes** (criar, editar, excluir, listar)
- ✅ **Normalização de dados** da API
- ✅ **Indicador visual** de letra faltante no alfabeto
- ✅ **Autenticação** com persistência de sessão

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** com TypeScript
- **Express.js** para API REST
- **SQLite** como banco de dados
- **JWT** para autenticação
- **bcryptjs** para hash de senhas
- **express-validator** para validação
- **Jest + Supertest** para testes

### Frontend
- **React 18** com TypeScript
- **Material-UI (MUI)** para componentes
- **MUI X Charts** para gráficos
- **React Router DOM** para navegação
- **Axios** para requisições HTTP
- **Context API** para gerenciamento de estado

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação Automática

#### Windows
```bash
# Clone o repositório
git clone https://github.com/marcos-ev/teste-tecnico-brinquedos.git
cd teste-tecnico-brinquedos

# Execute o script de instalação
install-and-run.bat
```

#### Linux/Mac
```bash
# Clone o repositório
git clone https://github.com/marcos-ev/teste-tecnico-brinquedos.git
cd teste-tecnico-brinquedos

# Dê permissão e execute o script
chmod +x install-and-run.sh
./install-and-run.sh
```

### Instalação Manual

#### 1. Instalar dependências
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

#### 2. Executar o projeto
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🌐 URLs de Acesso

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

## 🔐 Credenciais de Acesso

- **Email:** admin@loja.com
- **Senha:** admin123

## 📊 Estrutura do Projeto

```
teste-tecnico-brinquedos/
├── backend/                 # API REST
│   ├── src/
│   │   ├── controllers/     # Controladores
│   │   ├── services/        # Lógica de negócio
│   │   ├── routes/          # Rotas da API
│   │   ├── middleware/      # Middlewares
│   │   ├── config/          # Configurações
│   │   ├── types/           # Tipos TypeScript
│   │   └── __tests__/       # Testes automatizados
│   └── package.json
├── frontend/                # Aplicação React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── services/        # Serviços de API
│   │   ├── contexts/        # Context API
│   │   ├── types/           # Tipos TypeScript
│   │   └── utils/           # Utilitários
│   └── package.json
├── install-and-run.bat      # Script Windows
├── install-and-run.sh       # Script Linux/Mac
└── README.md
```

## 🧪 Testes

### Executar Testes do Backend
```bash
cd backend
npm test
```

### Cobertura de Testes
```bash
cd backend
npm run test:coverage
```

## 📋 Endpoints da API

### Autenticação
- `POST /auth/login` - Login de usuário

### Clientes
- `GET /clients` - Listar clientes (com filtros)
- `POST /clients` - Criar cliente
- `PUT /clients/:id` - Atualizar cliente
- `DELETE /clients/:id` - Excluir cliente
- `GET /clients/:id` - Buscar cliente por ID

### Vendas
- `GET /sales` - Listar vendas
- `POST /sales` - Criar venda
- `GET /sales/stats` - Estatísticas diárias
- `GET /sales/top-clients` - Top clientes

## 🎯 Funcionalidades Especiais

### Normalização de Dados
O frontend normaliza dados da API que retorna estrutura aninhada:
```json
{
  "data": {
    "clientes": [
      {
        "info": {
          "nomeCompleto": "Ana Beatriz",
          "detalhes": {
            "email": "ana@example.com",
            "nascimento": "1992-05-01"
          }
        },
        "estatisticas": {
          "vendas": [...]
        },
        "duplicado": {
          "nomeCompleto": "Ana Beatriz"
        }
      }
    ]
  }
}
```

### Indicador de Letra Faltante
Sistema que identifica a primeira letra do alfabeto que não aparece no nome do cliente, exibindo visualmente com chip colorido.

## 🔧 Scripts Úteis

### Backend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run start        # Produção
npm test             # Executar testes
npm run reset-db     # Resetar banco de dados
```

### Frontend
```bash
npm start            # Desenvolvimento
npm run build        # Build para produção
npm test             # Executar testes
```

## 📈 Estatísticas do Projeto

- **Backend:** ~800 linhas de código
- **Frontend:** ~600 linhas de código
- **Testes:** ~300 linhas de código
- **Cobertura:** 100% das rotas principais

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto foi desenvolvido como teste técnico.

## 👨‍💻 Autor

**Marcos Eduardo**
- GitHub: [@marcos-ev](https://github.com/marcos-ev)

---

⭐ Se este projeto foi útil, considere dar uma estrela no repositório! 
