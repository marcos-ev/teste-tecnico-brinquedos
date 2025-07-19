import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../database.sqlite');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados:', err);
    process.exit(1);
  } else {
    console.log('Conectado ao banco SQLite');
    try {
      initializeTables();
    } catch (error) {
      console.error('Erro ao inicializar tabelas:', error);
    }
  }
});

function initializeTables() {
  // Tabela de usuários para autenticação
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de clientes
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      data_nascimento TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de vendas
  db.run(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      valor REAL NOT NULL,
      data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
    )
  `);

  // Inserir usuário padrão se não existir
  db.get('SELECT * FROM users WHERE email = ?', ['admin@loja.com'], (err, row) => {
    if (!row) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      db.run(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        ['admin@loja.com', hashedPassword]
      );
      console.log('Usuário padrão criado: admin@loja.com / admin123');
    }
  });

  // Inserir dados de exemplo
  setTimeout(() => {
    insertSampleData();
  }, 2000); // Aguardar um pouco mais para garantir que as tabelas foram criadas
}

function insertSampleData() {
  // Verificar se já existem clientes
  db.get('SELECT COUNT(*) as count FROM clients', (err, row) => {
    if (row && (row as any).count === 0) {
      // Inserir clientes de exemplo
      const sampleClients = [
        ['Ana Beatriz', 'ana.b@example.com', '1992-05-01'],
        ['Carlos Eduardo', 'cadu@example.com', '1987-08-15'],
        ['Maria Silva', 'maria@example.com', '1990-03-20'],
        ['João Santos', 'joao@example.com', '1985-12-10'],
        ['Pedro Oliveira', 'pedro@example.com', '1995-07-22'],
        ['Fernanda Costa', 'fernanda@example.com', '1988-11-14'],
        ['Lucas Mendes', 'lucas@example.com', '1993-04-08']
      ];

      sampleClients.forEach(([nome, email, dataNascimento]) => {
        db.run(
          'INSERT INTO clients (nome, email, data_nascimento) VALUES (?, ?, ?)',
          [nome, email, dataNascimento]
        );
      });

      // Inserir vendas de exemplo
      setTimeout(() => {
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

        sampleSales.forEach(([clientId, valor, data]) => {
          db.run(
            'INSERT INTO sales (client_id, valor, data) VALUES (?, ?, ?)',
            [clientId, valor, data]
          );
        });

        console.log('Dados de exemplo inseridos com 7 clientes e vendas variadas');
      }, 1000);
    }
  });
}

export function closeDatabase() {
  db.close((err) => {
    if (err) {
      console.error('Erro ao fechar banco de dados:', err);
    } else {
      console.log('Banco de dados fechado');
    }
  });
}

// Função para resetar o banco (útil para desenvolvimento)
export function resetDatabase() {
  console.log('🔄 Resetando banco de dados...');

  // Limpar tabelas
  db.run('DELETE FROM sales', (err) => {
    if (err) console.error('Erro ao limpar vendas:', err);
  });

  db.run('DELETE FROM clients', (err) => {
    if (err) console.error('Erro ao limpar clientes:', err);
  });

  // Recriar dados
  setTimeout(() => {
    insertSampleData();
  }, 500);
} 