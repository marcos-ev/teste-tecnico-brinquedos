const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function testSimple() {
  try {
    console.log('🧪 Teste simples da API...\n');

    // 1. Testar health check
    console.log('1️⃣ Testando health check...');
    try {
      const healthResponse = await axios.get(`${API_BASE}/health`);
      console.log('✅ Health check:', healthResponse.data);
    } catch (error) {
      console.log('❌ Health check falhou:', error.message);
      return;
    }

    // 2. Testar login
    console.log('\n2️⃣ Testando login...');
    try {
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: 'admin@loja.com',
        password: 'admin123'
      });
      console.log('✅ Login realizado:', loginResponse.data.success);
      console.log('🔑 Token recebido:', loginResponse.data.data.token ? 'Sim' : 'Não');

      const token = loginResponse.data.data.token;

      // 3. Testar listagem com token
      console.log('\n3️⃣ Testando listagem de clientes...');
      const headers = { 'Authorization': `Bearer ${token}` };
      const clientsResponse = await axios.get(`${API_BASE}/clients`, { headers });
      console.log('✅ Clientes carregados:', clientsResponse.data.data.clientes.length);

      // 4. Testar criação
      console.log('\n4️⃣ Testando criação de cliente...');
      const newClient = {
        nome: 'Teste Simples',
        email: 'teste@simples.com',
        dataNascimento: '1990-01-01'
      };

      const createResponse = await axios.post(`${API_BASE}/clients`, newClient, { headers });
      console.log('✅ Cliente criado:', createResponse.data.success);

      // 5. Verificar se apareceu na lista
      console.log('\n5️⃣ Verificando se cliente apareceu na lista...');
      const clientsResponse2 = await axios.get(`${API_BASE}/clients`, { headers });
      const newCount = clientsResponse2.data.data.clientes.length;
      console.log('📊 Clientes antes:', clientsResponse.data.data.clientes.length);
      console.log('📊 Clientes depois:', newCount);

      if (newCount > clientsResponse.data.data.clientes.length) {
        console.log('✅ Cliente foi adicionado à lista!');
      } else {
        console.log('❌ Cliente NÃO foi adicionado à lista');
      }

    } catch (error) {
      console.log('❌ Erro no teste:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testSimple(); 