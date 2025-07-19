const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function testAPI() {
  try {
    console.log('🧪 Testando API de clientes...\n');

    // 0. Fazer login primeiro
    console.log('0️⃣ Fazendo login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@loja.com',
      password: 'admin123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso');

    // Configurar headers com token
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    // 1. Testar listagem de clientes
    console.log('\n1️⃣ Testando listagem de clientes...');
    const listResponse = await axios.get(`${API_BASE}/clients`, { headers });
    console.log('✅ Lista de clientes:', listResponse.data.data.clientes.length, 'clientes');
    console.log('📊 Estrutura do primeiro cliente:', JSON.stringify(listResponse.data.data.clientes[0], null, 2));
    console.log('');

    // 2. Testar criação de cliente
    console.log('2️⃣ Testando criação de cliente...');
    const newClient = {
      nome: 'Teste API',
      email: 'teste@api.com',
      dataNascimento: '1990-01-01'
    };

    const createResponse = await axios.post(`${API_BASE}/clients`, newClient, { headers });
    console.log('✅ Cliente criado:', createResponse.data.data);
    console.log('');

    // 3. Testar listagem novamente
    console.log('3️⃣ Testando listagem após criação...');
    const listResponse2 = await axios.get(`${API_BASE}/clients`, { headers });
    console.log('✅ Lista atualizada:', listResponse2.data.data.clientes.length, 'clientes');

    const newClientInList = listResponse2.data.data.clientes.find(
      c => c.info.detalhes.email === 'teste@api.com'
    );

    if (newClientInList) {
      console.log('✅ Novo cliente encontrado na lista!');
    } else {
      console.log('❌ Novo cliente NÃO encontrado na lista!');
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

testAPI(); 