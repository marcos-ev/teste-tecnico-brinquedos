const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function testClientWithSales() {
  try {
    console.log('🧪 Testando cliente com vendas...\n');

    // 1. Fazer login
    console.log('1️⃣ Fazendo login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@loja.com',
      password: 'admin123'
    });

    const token = loginResponse.data.data.token;
    const headers = { 'Authorization': `Bearer ${token}` };
    console.log('✅ Login realizado');

    // 2. Verificar clientes existentes
    console.log('\n2️⃣ Verificando clientes existentes...');
    const initialClientsResponse = await axios.get(`${API_BASE}/clients`, { headers });
    const initialCount = initialClientsResponse.data.data.clientes.length;
    console.log('📊 Clientes existentes:', initialCount);

    // 3. Criar novo cliente
    console.log('\n3️⃣ Criando novo cliente...');
    const newClient = {
      nome: 'João das Vendas',
      email: 'joao@vendas.com',
      dataNascimento: '1985-06-15'
    };

    const createClientResponse = await axios.post(`${API_BASE}/clients`, newClient, { headers });
    console.log('✅ Cliente criado:', createClientResponse.data.data.info.nomeCompleto);

    // 4. Buscar o cliente criado para pegar o ID
    console.log('\n4️⃣ Buscando cliente criado...');
    const updatedClientsResponse = await axios.get(`${API_BASE}/clients`, { headers });
    const newClientInList = updatedClientsResponse.data.data.clientes.find(
      c => c.info.detalhes.email === 'joao@vendas.com'
    );

    if (!newClientInList) {
      console.log('❌ Cliente não encontrado na lista');
      return;
    }

    // Como não temos ID real, vamos usar o índice + 1 como ID temporário
    const clientIndex = updatedClientsResponse.data.data.clientes.findIndex(
      c => c.info.detalhes.email === 'joao@vendas.com'
    );
    const clientId = clientIndex + 1;
    console.log('🆔 ID do cliente:', clientId);

    // 5. Adicionar vendas para o cliente
    console.log('\n5️⃣ Adicionando vendas...');
    const sales = [
      { valor: 150.00, data: '2024-01-10' },
      { valor: 200.00, data: '2024-01-12' },
      { valor: 300.00, data: '2024-01-15' },
      { valor: 180.00, data: '2024-01-18' }
    ];

    for (let i = 0; i < sales.length; i++) {
      const sale = sales[i];
      try {
        const saleData = {
          clientId: clientId,
          valor: sale.valor,
          data: sale.data
        };

        const createSaleResponse = await axios.post(`${API_BASE}/sales`, saleData, { headers });
        console.log(`✅ Venda ${i + 1} criada: R$ ${sale.valor.toFixed(2)} em ${sale.data}`);
      } catch (error) {
        console.log(`❌ Erro ao criar venda ${i + 1}:`, error.response?.data?.error || error.message);
      }
    }

    // 6. Verificar estatísticas do cliente
    console.log('\n6️⃣ Verificando estatísticas...');
    try {
      const statsResponse = await axios.get(`${API_BASE}/sales/top-clients`, { headers });
      console.log('📊 Estatísticas dos top clientes carregadas');

      // Verificar se o novo cliente aparece nas estatísticas
      const topClients = statsResponse.data.data;
      console.log('🏆 Maior volume:', topClients.maiorVolume?.cliente?.nome || 'N/A');
      console.log('💰 Maior média:', topClients.maiorMedia?.cliente?.nome || 'N/A');
      console.log('📅 Maior frequência:', topClients.maiorFrequencia?.cliente?.nome || 'N/A');
    } catch (error) {
      console.log('❌ Erro ao carregar estatísticas:', error.response?.data?.error || error.message);
    }

    // 7. Verificar lista final de clientes
    console.log('\n7️⃣ Verificando lista final...');
    const finalClientsResponse = await axios.get(`${API_BASE}/clients`, { headers });
    const finalCount = finalClientsResponse.data.data.clientes.length;
    console.log('📊 Clientes finais:', finalCount);

    const finalClient = finalClientsResponse.data.data.clientes.find(
      c => c.info.detalhes.email === 'joao@vendas.com'
    );

    if (finalClient) {
      const vendasCount = finalClient.estatisticas.vendas.length;
      const totalVendas = finalClient.estatisticas.vendas.reduce((sum, v) => sum + v.valor, 0);
      console.log('✅ Cliente final encontrado');
      console.log('📈 Vendas do cliente:', vendasCount);
      console.log('💰 Total de vendas: R$', totalVendas.toFixed(2));
    } else {
      console.log('❌ Cliente não encontrado na lista final');
    }

    console.log('\n🎉 Teste concluído!');

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

testClientWithSales(); 