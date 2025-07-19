const sqlite3 = require('sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Resetando banco de dados...');

// Limpar todas as tabelas
db.serialize(() => {
  // Limpar vendas primeiro (devido à foreign key)
  db.run('DELETE FROM sales', (err) => {
    if (err) {
      console.error('Erro ao limpar vendas:', err);
    } else {
      console.log('✅ Vendas limpas');
    }
  });

  // Limpar clientes
  db.run('DELETE FROM clients', (err) => {
    if (err) {
      console.error('Erro ao limpar clientes:', err);
    } else {
      console.log('✅ Clientes limpos');
    }
  });

  // Limpar usuários (exceto admin)
  db.run('DELETE FROM users WHERE email != ?', ['admin@loja.com'], (err) => {
    if (err) {
      console.error('Erro ao limpar usuários:', err);
    } else {
      console.log('✅ Usuários limpos (admin mantido)');
    }
  });

  // Recriar usuário admin se não existir
  db.get('SELECT * FROM users WHERE email = ?', ['admin@loja.com'], (err, row) => {
    if (!row) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      db.run(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        ['admin@loja.com', hashedPassword]
      );
      console.log('✅ Usuário admin criado: admin@loja.com / admin123');
    } else {
      console.log('✅ Usuário admin já existe');
    }
  });

  // Inserir novos clientes
  const sampleClients = [
    ['Ana Beatriz', 'ana.b@example.com', '1992-05-01'],
    ['Carlos Eduardo', 'cadu@example.com', '1987-08-15'],
    ['Maria Silva', 'maria@example.com', '1990-03-20'],
    ['João Santos', 'joao@example.com', '1985-12-10'],
    ['Pedro Oliveira', 'pedro@example.com', '1995-07-22'],
    ['Fernanda Costa', 'fernanda@example.com', '1988-11-14'],
    ['Lucas Mendes', 'lucas@example.com', '1993-04-08']
  ];

  console.log('📝 Inserindo 7 clientes...');
  sampleClients.forEach(([nome, email, dataNascimento], index) => {
    db.run(
      'INSERT INTO clients (nome, email, data_nascimento) VALUES (?, ?, ?)',
      [nome, email, dataNascimento],
      function (err) {
        if (err) {
          console.error(`❌ Erro ao inserir cliente ${nome}:`, err);
        } else {
          console.log(`✅ Cliente ${index + 1}: ${nome} (ID: ${this.lastID})`);
        }
      }
    );
  });

  // Inserir vendas após um delay
  setTimeout(() => {
    console.log('💰 Inserindo vendas...');

    const sampleSales = [
      // Ana Beatriz (ID: 1) - Maior volume total
      [1, 150.00, '2024-01-01'],
      [1, 50.00, '2024-01-02'],
      [1, 200.00, '2024-01-03'],
      [1, 300.00, '2024-01-04'],
      [1, 100.00, '2024-01-05'],

      // Carlos Eduardo (ID: 2) - Maior média por venda
      [2, 500.00, '2024-01-01'],
      [2, 450.00, '2024-01-03'],
      [2, 480.00, '2024-01-05'],

      // Maria Silva (ID: 3) - Maior frequência (mais dias únicos)
      [3, 80.00, '2024-01-01'],
      [3, 120.00, '2024-01-02'],
      [3, 90.00, '2024-01-03'],
      [3, 150.00, '2024-01-04'],
      [3, 110.00, '2024-01-05'],
      [3, 95.00, '2024-01-06'],
      [3, 130.00, '2024-01-07'],

      // João Santos (ID: 4)
      [4, 120.00, '2024-01-01'],
      [4, 80.00, '2024-01-05'],
      [4, 200.00, '2024-01-08'],

      // Pedro Oliveira (ID: 5) - Novo cliente
      [5, 180.00, '2024-01-02'],
      [5, 220.00, '2024-01-04'],
      [5, 160.00, '2024-01-06'],
      [5, 190.00, '2024-01-08'],

      // Fernanda Costa (ID: 6) - Nova cliente
      [6, 250.00, '2024-01-01'],
      [6, 180.00, '2024-01-03'],
      [6, 320.00, '2024-01-05'],
      [6, 150.00, '2024-01-07'],

      // Lucas Mendes (ID: 7) - Novo cliente
      [7, 90.00, '2024-01-02'],
      [7, 140.00, '2024-01-04'],
      [7, 110.00, '2024-01-06'],
      [7, 170.00, '2024-01-08'],
      [7, 130.00, '2024-01-09']
    ];

    let salesInserted = 0;
    sampleSales.forEach(([clientId, valor, data]) => {
      db.run(
        'INSERT INTO sales (client_id, valor, data) VALUES (?, ?, ?)',
        [clientId, valor, data],
        function (err) {
          if (err) {
            console.error(`❌ Erro ao inserir venda:`, err);
          } else {
            salesInserted++;
            if (salesInserted === sampleSales.length) {
              console.log(`✅ ${salesInserted} vendas inseridas com sucesso!`);
              console.log('🎉 Banco de dados resetado com sucesso!');
              console.log('📊 Agora você tem 7 clientes com vendas variadas');
              db.close();
            }
          }
        }
      );
    });
  }, 2000);
}); 