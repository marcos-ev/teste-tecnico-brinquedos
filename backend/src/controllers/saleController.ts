import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { SaleService } from '../services/saleService';
import { CreateSaleRequest, ApiResponse } from '../types';

export class SaleController {
  static async getDailyStats(req: Request, res: Response) {
    try {
      const stats = await SaleService.getDailyStats();

      const response: ApiResponse<any> = {
        success: true,
        data: stats
      };

      res.json(response);
    } catch (error) {
      console.error('Erro ao buscar estatísticas diárias:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  static async getTopClientsStats(req: Request, res: Response) {
    try {
      const stats = await SaleService.getTopClientsStats();

      const response: ApiResponse<any> = {
        success: true,
        data: stats
      };

      res.json(response);
    } catch (error) {
      console.error('Erro ao buscar estatísticas dos top clientes:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Dados inválidos',
          details: errors.array()
        });
      }

      const saleData: CreateSaleRequest = req.body;

      const sale = await SaleService.create(saleData);

      const response: ApiResponse<any> = {
        success: true,
        data: sale,
        message: 'Venda registrada com sucesso'
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Erro ao criar venda:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
    return;
  }

  static async list(req: Request, res: Response) {
    try {
      const sales = await SaleService.findAll();

      const response: ApiResponse<any> = {
        success: true,
        data: sales
      };

      res.json(response);
    } catch (error) {
      console.error('Erro ao listar vendas:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  static validateCreate() {
    return [
      body('clientId').isInt().withMessage('ID do cliente inválido'),
      body('valor').isFloat({ min: 0 }).withMessage('Valor deve ser um número positivo'),
      body('data').isISO8601().withMessage('Data inválida')
    ];
  }
} 