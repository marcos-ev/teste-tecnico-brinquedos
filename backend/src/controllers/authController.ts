import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService } from '../services/authService';
import { generateToken } from '../middleware/auth';
import { LoginRequest, ApiResponse, LoginResponse } from '../types';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Dados inválidos',
          details: errors.array()
        });
      }

      const { email, password }: LoginRequest = req.body;

      const user = await AuthService.login({ email, password });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Email ou senha inválidos'
        });
      }

      const token = generateToken(user);

      const response: ApiResponse<LoginResponse> = {
        success: true,
        data: {
          token,
          user
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
    return;
  }

  static validateLogin() {
    return [
      body('email').isEmail().withMessage('Email inválido'),
      body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
    ];
  }
} 