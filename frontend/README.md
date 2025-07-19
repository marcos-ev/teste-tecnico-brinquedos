# Frontend - Loja de Brinquedos

Aplicação React com TypeScript para gerenciamento de clientes e vendas.

## 🏗️ Arquitetura

- **Framework**: React 18
- **Linguagem**: TypeScript
- **UI Library**: Material-UI (MUI)
- **Roteamento**: React Router DOM
- **Gráficos**: MUI X Charts
- **Gerenciamento de Estado**: Context API
- **HTTP Client**: Axios

## 📁 Estrutura

```
src/
├── components/      # Componentes React
├── contexts/        # Contextos (Auth)
├── services/        # Serviços de API
└── types/           # Interfaces TypeScript
```

## 🚀 Como Executar

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm start
```

### Produção
```bash
npm run build
```

### Testes
```bash
npm test
```

## 🎨 Funcionalidades

### Autenticação
- Login com JWT
- Proteção de rotas
- Persistência de sessão

### Gerenciamento de Clientes
- Listagem com busca
- Criação de clientes
- Edição de dados
- Exclusão de clientes
- Indicador de letra faltante no nome

### Estatísticas
- Gráfico de vendas diárias
- Top clientes destacados:
  - Maior volume de vendas
  - Maior média por venda
  - Maior frequência de compras
- Dashboard com resumos

### Normalização de Dados
O frontend trata e normaliza os dados da API conforme especificação:
- Remove duplicações
- Extrai informações relevantes
- Calcula indicadores

## 🔐 Autenticação

**Credenciais padrão:**
- Email: `admin@loja.com`
- Senha: `admin123`

## 📊 Componentes Principais

### Login
- Formulário de autenticação
- Validação de campos
- Tratamento de erros

### Layout
- AppBar com navegação
- Drawer lateral responsivo
- Menu de navegação

### ClientList
- Tabela de clientes
- Busca em tempo real
- Modal para criar/editar
- Indicador de letra faltante

### Stats
- Gráfico de barras (vendas diárias)
- Cards dos top clientes
- Resumo estatístico

### Dashboard
- Cards de resumo
- Top clientes
- Métricas gerais

## 🎯 Funcionalidade Especial

### Indicador de Letra Faltante
Para cada cliente, o sistema calcula a primeira letra do alfabeto (A-Z) que não aparece no nome completo:
- Se todas as letras estão presentes: exibe "-"
- Caso contrário: exibe a primeira letra faltante

## 🔧 Configuração

Variáveis de ambiente (`.env`):
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_NAME=Loja de Brinquedos
```

## 📱 Responsividade

A aplicação é totalmente responsiva:
- Desktop: Drawer lateral fixo
- Mobile: Drawer temporário
- Adaptação de layouts para diferentes telas

## 🎨 Tema

Tema personalizado do Material-UI:
- Cores primárias e secundárias
- Tipografia Roboto
- Componentes estilizados

## 🔄 Integração com API

- Interceptors para autenticação
- Tratamento automático de erros 401
- Normalização de dados da API
- Loading states e error handling 