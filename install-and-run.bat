@echo off
echo 🧸 Instalando e executando Loja de Brinquedos...
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não está instalado. Por favor, instale o Node.js primeiro.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
echo ✅ npm encontrado
echo.

REM Instalar dependências do projeto principal
echo 📦 Instalando dependências do projeto principal...
call npm install

REM Instalar dependências do backend
echo 📦 Instalando dependências do backend...
cd backend
call npm install
cd ..

REM Instalar dependências do frontend
echo 📦 Instalando dependências do frontend...
cd frontend
call npm install
cd ..

echo.
echo ✅ Todas as dependências foram instaladas!
echo.
echo 🚀 Para executar o projeto:
echo    npm run dev
echo.
echo 📋 Ou execute separadamente:
echo    Backend:  npm run dev:backend  (porta 3001)
echo    Frontend: npm run dev:frontend (porta 3000)
echo.
echo 🔐 Credenciais de acesso:
echo    Email: admin@loja.com
echo    Senha: admin123
echo.
echo 📊 URLs:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001
echo    Health:   http://localhost:3001/health
echo.
echo 🧪 Para executar os testes:
echo    npm test
echo.
pause 