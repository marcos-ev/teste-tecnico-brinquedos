import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Importar configurações
import { config } from './config/env';
import { db } from './config/database';

// Importar rotas
import authRoutes from './routes/authRoutes';
import clientRoutes from './routes/clientRoutes';
import saleRoutes from './routes/saleRoutes';

const app = express();
const PORT = config.port;

// Middlewares
app.use(helmet());
app.use(cors({
  origin: config.nodeEnv === 'production'
    ? ['https://seu-dominio.com']
    : [config.corsOrigin],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas
app.use('/auth', authRoutes);
app.use('/clients', clientRoutes);
app.use('/sales', saleRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  // Verificar se o banco está funcionando
  db.get('SELECT COUNT(*) as count FROM clients', (err, row) => {
    if (err) {
      res.status(500).json({
        status: 'ERROR',
        message: 'Database connection failed',
        error: err.message,
        timestamp: new Date().toISOString()
      });
    } else {
      res.json({
        status: 'OK',
        database: 'Connected',
        clientsCount: row?.count || 0,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    }
  });
});

// Rota para resetar banco (apenas desenvolvimento)
if (config.nodeEnv === 'development') {
  app.post('/reset-database', (req, res) => {
    const { resetDatabase } = require('./config/database');
    resetDatabase();
    res.json({
      success: true,
      message: 'Banco de dados resetado com sucesso'
    });
  });
}

// Middleware de tratamento de erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Login: http://localhost:${PORT}/auth/login`);
  console.log(`👥 Clientes: http://localhost:${PORT}/clients`);
  console.log(`📈 Vendas: http://localhost:${PORT}/sales`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido, fechando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recebido, fechando servidor...');
  process.exit(0);
}); 