import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { DailySalesStats, TopClientsStats, NormalizedClient } from '../types';
import { saleService } from '../services/saleService';
import { clientService } from '../services/clientService';

const Dashboard: React.FC = () => {
  const [dailyStats, setDailyStats] = useState<DailySalesStats[]>([]);
  const [topClients, setTopClients] = useState<TopClientsStats | null>(null);
  const [clients, setClients] = useState<NormalizedClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dailyData, topData, clientsData] = await Promise.all([
        saleService.getDailyStats(),
        saleService.getTopClientsStats(),
        clientService.getClients()
      ]);
      setDailyStats(dailyData);
      setTopClients(topData);
      setClients(clientsData);
    } catch (err: any) {
      setError('Erro ao carregar dados do dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  const totalVendas = dailyStats.reduce((total, stat) => total + stat.total, 0);
  const mediaVendas = dailyStats.length > 0 ? totalVendas / dailyStats.length : 0;
  const totalClientes = clients.length;
  const clientesComVendas = clients.filter(client => client.vendas.length > 0).length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        🏠 Dashboard
      </Typography>

      {/* Cards de resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <MoneyIcon sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">
                    R$ {totalVendas.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">
                    Total de Vendas
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'secondary.light', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">
                    R$ {mediaVendas.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">
                    Média por Dia
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">
                    {totalClientes}
                  </Typography>
                  <Typography variant="body2">
                    Total de Clientes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CalendarIcon sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">
                    {clientesComVendas}
                  </Typography>
                  <Typography variant="body2">
                    Clientes Ativos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top clientes */}
      {topClients && topClients.maiorVolume?.cliente && topClients.maiorMedia?.cliente && topClients.maiorFrequencia?.cliente && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            🏆 Top Clientes
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    💰 Maior Volume
                  </Typography>
                  <Typography variant="h4" gutterBottom>
                    R$ {(topClients.maiorVolume?.totalVendas || 0).toFixed(2)}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {topClients.maiorVolume?.cliente?.nome || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {topClients.maiorVolume?.cliente?.email || 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="secondary" gutterBottom>
                    📈 Maior Média
                  </Typography>
                  <Typography variant="h4" gutterBottom>
                    R$ {(topClients.maiorMedia?.mediaValor || 0).toFixed(2)}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {topClients.maiorMedia?.cliente?.nome || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {topClients.maiorMedia?.cliente?.email || 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="success.main" gutterBottom>
                    🗓️ Maior Frequência
                  </Typography>
                  <Typography variant="h4" gutterBottom>
                    {topClients.maiorFrequencia?.diasUnicos || 0} dias
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {topClients.maiorFrequencia?.cliente?.nome || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {topClients.maiorFrequencia?.cliente?.email || 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Últimas vendas */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          📊 Resumo das Vendas
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <Typography variant="h3" color="primary">
                {dailyStats.length}
              </Typography>
              <Typography variant="body1">
                Dias com Vendas
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <Typography variant="h3" color="secondary">
                {Math.max(...dailyStats.map(stat => stat.total), 0).toFixed(0)}
              </Typography>
              <Typography variant="body1">
                Maior Venda (R$)
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <Typography variant="h3" color="success.main">
                {Math.min(...dailyStats.map(stat => stat.total), Infinity).toFixed(0)}
              </Typography>
              <Typography variant="body1">
                Menor Venda (R$)
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <Typography variant="h3" color="warning.main">
                {((clientesComVendas / totalClientes) * 100).toFixed(0)}%
              </Typography>
              <Typography variant="body1">
                Taxa de Conversão
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard; 