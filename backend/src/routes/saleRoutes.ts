import { Router } from 'express';
import { SaleController } from '../controllers/saleController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Aplicar autenticação em todas as rotas
router.use(authenticateToken);

// Rotas de estatísticas
router.get('/stats', SaleController.getDailyStats);
router.get('/top-clients', SaleController.getTopClientsStats);

// Rotas de vendas
router.get('/', SaleController.list);
router.post('/', SaleController.validateCreate(), SaleController.create);

export default router; 