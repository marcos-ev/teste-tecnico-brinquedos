import { db } from '../config/database';
import { Sale, CreateSaleRequest, DailySalesStats, TopClientsStats, Client } from '../types';

export class SaleService {
  static async findAll(): Promise<Sale[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM sales ORDER BY data DESC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Sale[]);
        }
      });
    });
  }

  static async findByClientId(clientId: number): Promise<Sale[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM sales WHERE client_id = ? ORDER BY data DESC', [clientId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Sale[]);
        }
      });
    });
  }

  static async create(saleData: CreateSaleRequest): Promise<Sale> {
    return new Promise((resolve, reject) => {
      const { clientId, valor, data } = saleData;

      db.run(
        'INSERT INTO sales (client_id, valor, data) VALUES (?, ?, ?)',
        [clientId, valor, data],
        function (err) {
          if (err) {
            reject(err);
          } else {
            this.get('SELECT * FROM sales WHERE id = ?', [this.lastID], (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row as Sale);
              }
            });
          }
        }
      );
    });
  }

  static async getDailyStats(): Promise<DailySalesStats[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT data, SUM(valor) as total
        FROM sales
        GROUP BY data
        ORDER BY data DESC
        LIMIT 30
      `;

      db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as DailySalesStats[]);
        }
      });
    });
  }

  static async getTopClientsStats(): Promise<TopClientsStats> {
    return new Promise((resolve, reject) => {
      // Cliente com maior volume de vendas
      const volumeQuery = `
        SELECT c.*, COALESCE(SUM(s.valor), 0) as total_vendas
        FROM clients c
        LEFT JOIN sales s ON c.id = s.client_id
        GROUP BY c.id
        ORDER BY total_vendas DESC
        LIMIT 1
      `;

      // Cliente com maior média de valor por venda
      const mediaQuery = `
        SELECT c.*, AVG(s.valor) as media_valor
        FROM clients c
        LEFT JOIN sales s ON c.id = s.client_id
        WHERE s.id IS NOT NULL
        GROUP BY c.id
        ORDER BY media_valor DESC
        LIMIT 1
      `;

      // Cliente com maior frequência de compras (dias únicos)
      const frequenciaQuery = `
        SELECT c.*, COUNT(DISTINCT s.data) as dias_unicos
        FROM clients c
        LEFT JOIN sales s ON c.id = s.client_id
        GROUP BY c.id
        ORDER BY dias_unicos DESC
        LIMIT 1
      `;

      db.get(volumeQuery, (err, volumeRow) => {
        if (err) {
          reject(err);
          return;
        }

        db.get(mediaQuery, (err, mediaRow) => {
          if (err) {
            reject(err);
            return;
          }

          db.get(frequenciaQuery, (err, frequenciaRow) => {
            if (err) {
              reject(err);
              return;
            }

            // Garantir que sempre retornamos dados válidos
            const defaultClient: Client = {
              id: 0,
              nome: 'Nenhum cliente',
              email: 'n/a',
              dataNascimento: '1900-01-01',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };

            resolve({
              maiorVolume: {
                cliente: volumeRow as Client || defaultClient,
                totalVendas: volumeRow?.total_vendas || 0
              },
              maiorMedia: {
                cliente: mediaRow as Client || defaultClient,
                mediaValor: mediaRow?.media_valor || 0
              },
              maiorFrequencia: {
                cliente: frequenciaRow as Client || defaultClient,
                diasUnicos: frequenciaRow?.dias_unicos || 0
              }
            });
          });
        });
      });
    });
  }

  static async getClientSalesWithStats(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          c.id,
          c.nome,
          c.email,
          c.data_nascimento,
          c.created_at,
          c.updated_at,
          s.id as sale_id,
          s.valor,
          s.data as sale_data
        FROM clients c
        LEFT JOIN sales s ON c.id = s.client_id
        ORDER BY c.nome, s.data DESC
      `;

      db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Agrupar vendas por cliente
          const clientsMap = new Map();

          rows.forEach((row: any) => {
            if (!clientsMap.has(row.id)) {
              clientsMap.set(row.id, {
                id: row.id,
                nome: row.nome,
                email: row.email,
                data_nascimento: row.data_nascimento,
                created_at: row.created_at,
                updated_at: row.updated_at,
                vendas: []
              });
            }

            if (row.sale_id) {
              clientsMap.get(row.id).vendas.push({
                id: row.sale_id,
                valor: row.valor,
                data: row.sale_data
              });
            }
          });

          resolve(Array.from(clientsMap.values()));
        }
      });
    });
  }
} 