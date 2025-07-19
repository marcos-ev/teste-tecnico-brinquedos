import request from 'supertest';
import express from 'express';
import clientRoutes from '../routes/clientRoutes';
import { generateToken } from '../middleware/auth';

const app = express();
app.use(express.json());
app.use('/clients', clientRoutes);

// Token de teste
const testToken = generateToken({ id: 1, email: 'admin@loja.com' });

describe('Client Routes', () => {
  describe('GET /clients', () => {
    it('deve listar clientes com autenticação', async () => {
      const response = await request(app)
        .get('/clients')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('clientes');
      expect(response.body).toHaveProperty('meta');
      expect(response.body).toHaveProperty('redundante');
    });

    it('deve rejeitar requisição sem token', async () => {
      const response = await request(app)
        .get('/clients');

      expect(response.status).toBe(401);
    });

    it('deve filtrar clientes por busca', async () => {
      const response = await request(app)
        .get('/clients?search=Ana')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe('POST /clients', () => {
    it('deve criar cliente válido', async () => {
      const clientData = {
        nome: 'João Silva',
        email: 'joao.silva@test.com',
        dataNascimento: '1990-01-01'
      };

      const response = await request(app)
        .post('/clients')
        .set('Authorization', `Bearer ${testToken}`)
        .send(clientData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.nome).toBe(clientData.nome);
    });

    it('deve validar dados obrigatórios', async () => {
      const response = await request(app)
        .post('/clients')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          nome: '',
          email: 'email-invalido',
          dataNascimento: 'data-invalida'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('deve rejeitar email duplicado', async () => {
      const clientData = {
        nome: 'Teste Duplicado',
        email: 'admin@loja.com', // Email já existe
        dataNascimento: '1990-01-01'
      };

      const response = await request(app)
        .post('/clients')
        .set('Authorization', `Bearer ${testToken}`)
        .send(clientData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email já cadastrado');
    });
  });

  describe('PUT /clients/:id', () => {
    it('deve atualizar cliente existente', async () => {
      const updateData = {
        nome: 'Nome Atualizado'
      };

      const response = await request(app)
        .put('/clients/1')
        .set('Authorization', `Bearer ${testToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('deve retornar erro para cliente inexistente', async () => {
      const response = await request(app)
        .put('/clients/999')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ nome: 'Teste' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /clients/:id', () => {
    it('deve excluir cliente existente', async () => {
      // Primeiro criar um cliente para excluir
      const clientData = {
        nome: 'Cliente para Excluir',
        email: 'excluir@test.com',
        dataNascimento: '1990-01-01'
      };

      const createResponse = await request(app)
        .post('/clients')
        .set('Authorization', `Bearer ${testToken}`)
        .send(clientData);

      const clientId = createResponse.body.data.id;

      const response = await request(app)
        .delete(`/clients/${clientId}`)
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('deve retornar erro para cliente inexistente', async () => {
      const response = await request(app)
        .delete('/clients/999')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(404);
    });
  });
}); 