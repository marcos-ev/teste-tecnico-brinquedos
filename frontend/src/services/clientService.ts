import api from './api';
import {
  CreateClientRequest,
  UpdateClientRequest,
  ApiResponse,
  ClientsListResponse,
  NormalizedClient
} from '../types';

export const clientService = {
  async getClients(search?: string): Promise<NormalizedClient[]> {
    const params = search ? { search } : {};
    const response = await api.get<ClientsListResponse>('/clients', { params });

    // Normalizar dados conforme especificação do teste
    return response.data.data.clientes.map((cliente, index) => {
      const nome = cliente.info?.nomeCompleto || 'Nome não informado';
      const letraFaltante = this.findMissingLetter(nome);

      return {
        id: index + 1, // Usar índice como ID temporário
        nome: nome,
        email: cliente.info?.detalhes?.email || 'email@não.informado',
        dataNascimento: cliente.info?.detalhes?.nascimento || null,
        vendas: cliente.estatisticas?.vendas || [],
        letraFaltante
      };
    });
  },

  async createClient(clientData: CreateClientRequest): Promise<any> {
    const response = await api.post<ApiResponse<any>>('/clients', clientData);
    return response.data.data;
  },

  async updateClient(id: number, clientData: UpdateClientRequest): Promise<any> {
    // Filtrar apenas campos que foram preenchidos
    const filteredData = Object.fromEntries(
      Object.entries(clientData).filter(([_, value]) => value !== undefined && value !== '')
    );
    const response = await api.put<ApiResponse<any>>(`/clients/${id}`, filteredData);
    return response.data.data;
  },

  async deleteClient(id: number): Promise<void> {
    await api.delete(`/clients/${id}`);
  },

  // Função para encontrar a primeira letra do alfabeto que não aparece no nome
  findMissingLetter(nome: string): string {
    if (!nome || typeof nome !== 'string') {
      return '-';
    }

    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const nomeLower = nome.toLowerCase();

    for (const letter of alphabet) {
      if (!nomeLower.includes(letter)) {
        return letter.toUpperCase();
      }
    }

    return '-'; // Todas as letras estão presentes
  }
}; 