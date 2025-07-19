import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/authRoutes';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  describe('POST /auth/login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'admin@loja.com',
          password: 'admin123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe('admin@loja.com');
    });

    it('deve retornar erro com credenciais inválidas', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'admin@loja.com',
          password: 'senhaerrada'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Email ou senha inválidos');
    });

    it('deve validar email inválido', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'email-invalido',
          password: 'admin123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('deve validar senha muito curta', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'admin@loja.com',
          password: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
}); 