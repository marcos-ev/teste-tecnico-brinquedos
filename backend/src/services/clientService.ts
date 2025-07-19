import { db } from '../config/database';
import { Client, CreateClientRequest, UpdateClientRequest, PaginationParams } from '../types';

export class ClientService {
  static async findAll(params: PaginationParams = {}): Promise<Client[]> {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM clients';
      const queryParams: any[] = [];
      const conditions: string[] = [];

      if (params.search) {
        conditions.push('(nome LIKE ? OR email LIKE ?)');
        queryParams.push(`%${params.search}%`, `%${params.search}%`);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY nome ASC';

      if (params.limit) {
        query += ' LIMIT ?';
        queryParams.push(params.limit);

        if (params.page) {
          const offset = (params.page - 1) * params.limit;
          query += ' OFFSET ?';
          queryParams.push(offset);
        }
      }

      db.all(query, queryParams, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Client[]);
        }
      });
    });
  }

  static async findById(id: number): Promise<Client | null> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM clients WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as Client || null);
        }
      });
    });
  }

  static async findByEmail(email: string): Promise<Client | null> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM clients WHERE email = ?', [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as Client || null);
        }
      });
    });
  }

  static async create(clientData: CreateClientRequest): Promise<Client> {
    return new Promise((resolve, reject) => {
      const { nome, email, dataNascimento } = clientData;

      // Usar prepared statement para evitar problemas de concorrência
      const stmt = db.prepare('INSERT INTO clients (nome, email, data_nascimento) VALUES (?, ?, ?)');
      
      stmt.run([nome, email, dataNascimento], function (err) {
        if (err) {
          stmt.finalize();
          reject(err);
        } else {
          const clientId = this.lastID;
          stmt.finalize();
          
          // Buscar o cliente criado
          db.get('SELECT * FROM clients WHERE id = ?', [clientId], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row as Client);
            }
          });
        }
      });
    });
  }

  static async update(id: number, clientData: UpdateClientRequest): Promise<Client | null> {
    return new Promise((resolve, reject) => {
      const updates: string[] = [];
      const values: any[] = [];

      if (clientData.nome !== undefined && clientData.nome !== '') {
        updates.push('nome = ?');
        values.push(clientData.nome);
      }

      if (clientData.email !== undefined && clientData.email !== '') {
        updates.push('email = ?');
        values.push(clientData.email);
      }

      if (clientData.dataNascimento !== undefined && clientData.dataNascimento !== '') {
        updates.push('data_nascimento = ?');
        values.push(clientData.dataNascimento);
      }

      if (updates.length === 0) {
        resolve(null);
        return;
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      const query = `UPDATE clients SET ${updates.join(', ')} WHERE id = ?`;

      // Usar prepared statement para evitar problemas de concorrência
      const stmt = db.prepare(query);
      
      stmt.run(values, function (err) {
        if (err) {
          stmt.finalize();
          reject(err);
        } else {
          if (this.changes > 0) {
            stmt.finalize();
            // Usar uma nova consulta separada para buscar o cliente atualizado
            db.get('SELECT * FROM clients WHERE id = ?', [id], (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row as Client);
              }
            });
          } else {
            stmt.finalize();
            resolve(null);
          }
        }
      });
    });
  }

  static async delete(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM clients WHERE id = ?', [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  static async count(params: PaginationParams = {}): Promise<number> {
    return new Promise((resolve, reject) => {
      let query = 'SELECT COUNT(*) as count FROM clients';
      const queryParams: any[] = [];
      const conditions: string[] = [];

      if (params.search) {
        conditions.push('(nome LIKE ? OR email LIKE ?)');
        queryParams.push(`%${params.search}%`, `%${params.search}%`);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      db.get(query, queryParams, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve((row as any).count);
        }
      });
    });
  }
} 