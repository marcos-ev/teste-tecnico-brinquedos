export interface Client {
  id: number;
  nome: string;
  email: string;
  dataNascimento: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientRequest {
  nome: string;
  email: string;
  dataNascimento: string;
}

export interface UpdateClientRequest {
  nome?: string;
  email?: string;
  dataNascimento?: string;
}

export interface Sale {
  id: number;
  clientId: number;
  valor: number;
  data: string;
  createdAt: string;
}

export interface DailySalesStats {
  data: string;
  total: number;
}

export interface TopClientsStats {
  maiorVolume: {
    cliente: Client;
    totalVendas: number;
  };
  maiorMedia: {
    cliente: Client;
    mediaValor: number;
  };
  maiorFrequencia: {
    cliente: Client;
    diasUnicos: number;
  };
}

// Interface para dados normalizados do cliente
export interface NormalizedClient {
  id: number;
  nome: string;
  email: string;
  dataNascimento: string | null;
  vendas: Array<{
    data: string;
    valor: number;
  }>;
  letraFaltante: string;
}

// Interface para resposta da API de clientes (formato original)
export interface ClientsListResponse {
  data: {
    clientes: Array<{
      info: {
        nomeCompleto: string;
        detalhes: {
          email: string;
          nascimento: string;
        };
      };
      estatisticas: {
        vendas: Array<{
          data: string;
          valor: number;
        }>;
      };
      duplicado?: {
        nomeCompleto: string;
      };
    }>;
  };
  meta: {
    registroTotal: number;
    pagina: number;
  };
  redundante: {
    status: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: LoginResponse['user'] | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  token: string | null;
} 