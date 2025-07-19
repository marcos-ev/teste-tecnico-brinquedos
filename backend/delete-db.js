const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');

console.log('🗑️ Deletando banco de dados...');

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('✅ Banco de dados deletado com sucesso!');
  console.log('🔄 Reinicie o backend para recriar o banco com os novos dados');
} else {
  console.log('ℹ️ Banco de dados não existe, nada a deletar');
} 