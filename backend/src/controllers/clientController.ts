import { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { ClientService } from '../services/clientService';
import { SaleService } from '../services/saleService';
import { CreateClientRequest, UpdateClientRequest, ApiResponse, ClientsListResponse, PaginationParams } from '../types';

export class ClientController {
  static async list(req: Request, res: Response) {
    try {
      const { page, limit, search }: PaginationParams = req.query as any;

      const params: PaginationParams = {
        page: page ? parseInt(String(page)) : 1,
        limit: limit ? parseInt(String(limit)) : 10,
        search: search || undefined
      };

      const clients = await ClientService.findAll(params);
      const total = await ClientService.count(params);

      // Formatar resposta conforme especificação do teste
      const formattedClients = clients.map(client => ({
        info: {
          nomeCompleto: client.nome || 'Nome não informado',
          detalhes: {
            email: client.email || 'email@não.informado',
            nascimento: client.dataNascimento || '1900-01-01'
          }
        },
        estatisticas: {
          vendas: [] // Será preenchido abaixo
        },
        duplicado: {
          nomeCompleto: client.nome || 'Nome não informado' // Duplicação conforme especificação
        }
      }));

      // Buscar vendas para cada cliente
      for (let i = 0; i < formattedClients.length; i++) {
        const clientId = clients[i].id;
        const sales = await SaleService.findByClientId(clientId);
        formattedClients[i].estatisticas.vendas = sales.map(sale => ({
          data: sale.data,
          valor: sale.valor
        })) as any;
      }

      const response: ClientsListResponse = {
        data: {
          clientes: formattedClients
        },
        meta: {
          registroTotal: total,
          pagina: params.page || 1
        },
        redundante: {
          status: 'ok'
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
    return;
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const client = await ClientService.findById(id);

      if (!client) {
        return res.status(404).json({
          success: false,
          error: 'Cliente não encontrado'
        });
      }

      const response: ApiResponse<any> = {
        success: true,
        data: client
      };

      res.json(response);
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
    return;
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

      const clientData: CreateClientRequest = req.body;

      // Verificar se email já existe
      const existingClient = await ClientService.findByEmail(clientData.email);
      if (existingClient) {
        return res.status(400).json({
          success: false,
          error: 'Email já cadastrado'
        });
      }

      const client = await ClientService.create(clientData);

      // Formatar resposta no mesmo formato da listagem
      const formattedClient = {
        info: {
          nomeCompleto: client.nome || 'Nome não informado',
          detalhes: {
            email: client.email || 'email@não.informado',
            nascimento: client.dataNascimento || '1900-01-01'
          }
        },
        estatisticas: {
          vendas: [] // Cliente novo não tem vendas
        },
        duplicado: {
          nomeCompleto: client.nome || 'Nome não informado'
        }
      };

      const response: ApiResponse<any> = {
        success: true,
        data: formattedClient,
        message: 'Cliente criado com sucesso'
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Erro ao criar cliente:', error);

      // Verificar se é erro de SQLite
      if (error && (error as any).code === 'SQLITE_MISUSE') {
        res.status(500).json({
          success: false,
          error: 'Erro de conexão com banco de dados. Tente novamente.'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Erro interno do servidor'
        });
      }
    }
    return;
  }

  static async update(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Dados inválidos',
          details: errors.array()
        });
      }

      const id = parseInt(req.params.id);
      const clientData: UpdateClientRequest = req.body;

      // Verificar se cliente existe
      const existingClient = await ClientService.findById(id);
      if (!existingClient) {
        return res.status(404).json({
          success: false,
          error: 'Cliente não encontrado'
        });
      }

      // Se email foi alterado, verificar se já existe
      if (clientData.email && clientData.email !== existingClient.email) {
        const emailExists = await ClientService.findByEmail(clientData.email);
        if (emailExists) {
          return res.status(400).json({
            success: false,
            error: 'Email já cadastrado'
          });
        }
      }

      // Filtrar apenas campos que foram enviados
      const filteredData: UpdateClientRequest = {};
      if (clientData.nome !== undefined) filteredData.nome = clientData.nome;
      if (clientData.email !== undefined) filteredData.email = clientData.email;
      if (clientData.dataNascimento !== undefined) filteredData.dataNascimento = clientData.dataNascimento;

      const updatedClient = await ClientService.update(id, filteredData);

      if (!updatedClient) {
        return res.status(400).json({
          success: false,
          error: 'Nenhuma alteração realizada'
        });
      }

      // Formatar resposta no mesmo formato da listagem
      const formattedClient = {
        info: {
          nomeCompleto: updatedClient.nome || 'Nome não informado',
          detalhes: {
            email: updatedClient.email || 'email@não.informado',
            nascimento: updatedClient.dataNascimento || '1900-01-01'
          }
        },
        estatisticas: {
          vendas: [] // Será preenchido se necessário
        },
        duplicado: {
          nomeCompleto: updatedClient.nome || 'Nome não informado'
        }
      };

      const response: ApiResponse<any> = {
        success: true,
        data: formattedClient,
        message: 'Cliente atualizado com sucesso'
      };

      res.json(response);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
    return;
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      // Verificar se cliente existe
      const existingClient = await ClientService.findById(id);
      if (!existingClient) {
        return res.status(404).json({
          success: false,
          error: 'Cliente não encontrado'
        });
      }

      const deleted = await ClientService.delete(id);

      if (!deleted) {
        return res.status(400).json({
          success: false,
          error: 'Erro ao excluir cliente'
        });
      }

      const response: ApiResponse<null> = {
        success: true,
        message: 'Cliente excluído com sucesso'
      };

      res.json(response);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
    return;
  }

  static validateCreate() {
    return [
      body('nome').notEmpty().trim().withMessage('Nome é obrigatório'),
      body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
      body('dataNascimento').isISO8601().withMessage('Data de nascimento inválida')
    ];
  }

  static validateUpdate() {
    return [
      param('id').isInt().withMessage('ID inválido'),
      body('nome').optional().notEmpty().trim().withMessage('Nome não pode ser vazio'),
      body('email').optional().isEmail().normalizeEmail().withMessage('Email inválido'),
      body('dataNascimento').optional().isISO8601().withMessage('Data de nascimento inválida')
    ];
  }

  static validateId() {
    return [
      param('id').isInt().withMessage('ID inválido')
    ];
  }
} 