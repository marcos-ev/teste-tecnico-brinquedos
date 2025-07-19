#!/bin/bash

echo "🧸 Instalando e executando Loja de Brinquedos..."
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js primeiro."
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"
echo "✅ npm encontrado: $(npm --version)"
echo ""

# Instalar dependências do projeto principal
echo "📦 Instalando dependências do projeto principal..."
npm install

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
cd backend
npm install
cd ..

# Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Todas as dependências foram instaladas!"
echo ""
echo "🚀 Para executar o projeto:"
echo "   npm run dev"
echo ""
echo "📋 Ou execute separadamente:"
echo "   Backend:  npm run dev:backend  (porta 3001)"
echo "   Frontend: npm run dev:frontend (porta 3000)"
echo ""
echo "🔐 Credenciais de acesso:"
echo "   Email: admin@loja.com"
echo "   Senha: admin123"
echo ""
echo "📊 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   Health:   http://localhost:3001/health"
echo ""
echo "🧪 Para executar os testes:"
echo "   npm test"
echo "" 