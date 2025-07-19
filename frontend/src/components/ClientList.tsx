import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { NormalizedClient, CreateClientRequest } from '../types';
import { clientService } from '../services/clientService';

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<NormalizedClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<NormalizedClient | null>(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateClientRequest>({
    nome: '',
    email: '',
    dataNascimento: ''
  });

  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Carregando clientes...');
      const data = await clientService.getClients(searchTerm);
      console.log('📊 Clientes carregados:', data.length, 'clientes');
      setClients(data);
    } catch (err: any) {
      console.error('❌ Erro ao carregar clientes:', err);
      setError('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleCreateClient = async () => {
    try {
      // Validar campos obrigatórios
      if (!formData.nome.trim() || !formData.email.trim() || !formData.dataNascimento) {
        setError('Todos os campos são obrigatórios');
        return;
      }

      const createData = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        dataNascimento: formData.dataNascimento
      };

      console.log('🔄 Criando cliente:', createData);
      const result = await clientService.createClient(createData);
      console.log('✅ Cliente criado:', result);

      setOpenDialog(false);
      setFormData({ nome: '', email: '', dataNascimento: '' });

      console.log('🔄 Recarregando lista de clientes...');
      await loadClients();
      console.log('✅ Lista recarregada');
    } catch (err: any) {
      console.error('❌ Erro ao criar cliente:', err);
      setError(err.response?.data?.error || 'Erro ao criar cliente');
    }
  };

  const handleUpdateClient = async () => {
    if (!editingClient) return;

    try {
      // Filtrar campos vazios
      const updateData: any = {};
      if (formData.nome.trim()) updateData.nome = formData.nome.trim();
      if (formData.email.trim()) updateData.email = formData.email.trim();
      if (formData.dataNascimento) updateData.dataNascimento = formData.dataNascimento;

      await clientService.updateClient(editingClient.id, updateData);
      setOpenDialog(false);
      setEditingClient(null);
      setFormData({ nome: '', email: '', dataNascimento: '' });
      loadClients();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao atualizar cliente');
    }
  };

  const handleDeleteClient = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      await clientService.deleteClient(id);
      loadClients();
    } catch (err: any) {
      setError('Erro ao excluir cliente');
    }
  };

  const openEditDialog = (client: NormalizedClient) => {
    setEditingClient(client);
    setFormData({
      nome: client.nome,
      email: client.email,
      dataNascimento: client.dataNascimento || ''
    });
    setOpenDialog(true);
  };

  const openCreateDialog = () => {
    setEditingClient(null);
    setFormData({ nome: '', email: '', dataNascimento: '' });
    setOpenDialog(true);
  };

  const getTotalVendas = (vendas: Array<{ valor: number }>) => {
    return vendas.reduce((total, venda) => total + venda.valor, 0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Clientes</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
        >
          Novo Cliente
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Data de Nascimento</TableCell>
              <TableCell>Total de Vendas</TableCell>
              <TableCell>Letra Faltante</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.nome}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>
                  {client.dataNascimento ?
                    format(new Date(client.dataNascimento), 'dd/MM/yyyy', { locale: ptBR }) :
                    'N/A'
                  }
                </TableCell>
                <TableCell>
                  R$ {getTotalVendas(client.vendas).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Chip
                    label={client.letraFaltante}
                    color={client.letraFaltante === '-' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => openEditDialog(client)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClient(client.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Data de Nascimento"
              type="date"
              value={formData.dataNascimento}
              onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            onClick={editingClient ? handleUpdateClient : handleCreateClient}
            variant="contained"
          >
            {editingClient ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientList; 