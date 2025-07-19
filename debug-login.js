const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function debugLogin() {
  try {
    console.log('🔍 Debugando login...\n');

    // Testar login
    console.log('1️⃣ Fazendo login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@loja.com',
      password: 'admin123'
    });

    console.log('📊 Resposta completa do login:');
    console.log(JSON.stringify(loginResponse.data, null, 2));

    if (loginResponse.data.token) {
      console.log('\n✅ Token encontrado!');
      console.log('🔑 Token:', loginResponse.data.token.substring(0, 20) + '...');

      // Testar com token
      const headers = { 'Authorization': `Bearer ${loginResponse.data.token}` };
      console.log('\n2️⃣ Testando com token...');

      try {
        const clientsResponse = await axios.get(`${API_BASE}/clients`, { headers });
        console.log('✅ Lista de clientes carregada:', clientsResponse.data.data.clientes.length, 'clientes');
      } catch (error) {
        console.log('❌ Erro com token:', error.response?.data || error.message);
      }
    } else {
      console.log('\n❌ Token não encontrado na resposta');
    }

  } catch (error) {
    console.error('❌ Erro no debug:', error.response?.data || error.message);
  }
}

debugLogin(); 