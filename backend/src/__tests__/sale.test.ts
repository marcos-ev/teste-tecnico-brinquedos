import request from 'supertest';
import express from 'express';
import saleRoutes from '../routes/saleRoutes';
import { generateToken } from '../middleware/auth';

const app = express();
app.use(express.json());
app.use('/sales', saleRoutes);

// Token de teste
const testToken = generateToken({ id: 1, email: 'admin@loja.com' });

describe('Sale Routes', () => {
  describe('GET /sales/stats', () => {
    it('deve retornar estatísticas diárias com autenticação', async () => {
      const response = await request(app)
        .get('/sales/stats')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    it('deve rejeitar requisição sem token', async () => {
      const response = await request(app)
        .get('/sales/stats');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /sales/top-clients', () => {
    it('deve retornar estatísticas dos top clientes com autenticação', async () => {
      const response = await request(app)
        .get('/sales/top-clients')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('maiorVolume');
      expect(response.body.data).toHaveProperty('maiorMedia');
      expect(response.body.data).toHaveProperty('maiorFrequencia');
    });

    it('deve rejeitar requisição sem token', async () => {
      const response = await request(app)
        .get('/sales/top-clients');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /sales', () => {
    it('deve criar venda válida', async () => {
      const saleData = {
        clientId: 1,
        valor: 150.00,
        data: '2024-01-15'
      };

      const response = await request(app)
        .post('/sales')
        .set('Authorization', `Bearer ${testToken}`)
        .send(saleData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.valor).toBe(saleData.valor);
    });

    it('deve validar dados obrigatórios', async () => {
      const response = await request(app)
        .post('/sales')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          clientId: 'invalido',
          valor: -10,
          data: 'data-invalida'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('deve validar valor positivo', async () => {
      const response = await request(app)
        .post('/sales')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          clientId: 1,
          valor: -50,
          data: '2024-01-15'
        });

      expect(response.status).toBe(400);
    });

    it('deve validar data no formato ISO', async () => {
      const response = await request(app)
        .post('/sales')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          clientId: 1,
          valor: 100,
          data: '15/01/2024'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /sales', () => {
    it('deve listar vendas com autenticação', async () => {
      const response = await request(app)
        .get('/sales')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    it('deve rejeitar requisição sem token', async () => {
      const response = await request(app)
        .get('/sales');

      expect(response.status).toBe(401);
    });
  });
}); 