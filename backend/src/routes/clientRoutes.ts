import { Router } from 'express';
import { ClientController } from '../controllers/clientController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Aplicar autenticação em todas as rotas
router.use(authenticateToken);

// Rotas de clientes
router.get('/', ClientController.list);
router.get('/:id', ClientController.validateId(), ClientController.getById);
router.post('/', ClientController.validateCreate(), ClientController.create);
router.put('/:id', ClientController.validateUpdate(), ClientController.update);
router.delete('/:id', ClientController.validateId(), ClientController.delete);

export default router; 