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
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import {
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DailySalesStats, TopClientsStats } from '../types';
import { saleService } from '../services/saleService';

const Stats: React.FC = () => {
  const [dailyStats, setDailyStats] = useState<DailySalesStats[]>([]);
  const [topClients, setTopClients] = useState<TopClientsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [dailyData, topData] = await Promise.all([
        saleService.getDailyStats(),
        saleService.getTopClientsStats()
      ]);
      setDailyStats(dailyData);
      setTopClients(topData);
    } catch (err: any) {
      setError('Erro ao carregar estatísticas');
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

  // Preparar dados para o gráfico de barras
  const chartData = dailyStats
    .filter(stat => stat.data) // Filtrar apenas dados válidos
    .map(stat => ({
      data: format(new Date(stat.data), 'dd/MM', { locale: ptBR }),
      total: stat.total
    }))
    .reverse(); // Inverter para mostrar cronologicamente

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        📊 Estatísticas de Vendas
      </Typography>

      {/* Gráfico de vendas diárias */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Vendas por Dia
        </Typography>
        {chartData.length > 0 ? (
          <Box sx={{ height: 400 }}>
            <BarChart
              dataset={chartData}
              xAxis={[{ scaleType: 'band', dataKey: 'data' }]}
              series={[{ dataKey: 'total', label: 'Total de Vendas (R$)' }]}
              height={400}
            />
          </Box>
        ) : (
          <Typography color="text.secondary">
            Nenhum dado de venda disponível
          </Typography>
        )}
      </Paper>

      {/* Cards dos top clientes */}
      {topClients && topClients.maiorVolume?.cliente && topClients.maiorMedia?.cliente && topClients.maiorFrequencia?.cliente && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{
              bgcolor: 'primary.light',
              color: 'white',
              height: '100%'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <MoneyIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Maior Volume
                  </Typography>
                </Box>
                <Typography variant="h4" gutterBottom>
                  R$ {(topClients.maiorVolume?.totalVendas || 0).toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  {topClients.maiorVolume?.cliente?.nome || 'N/A'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {topClients.maiorVolume?.cliente?.email || 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{
              bgcolor: 'secondary.light',
              color: 'white',
              height: '100%'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <TrendingUpIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Maior Média
                  </Typography>
                </Box>
                <Typography variant="h4" gutterBottom>
                  R$ {(topClients.maiorMedia?.mediaValor || 0).toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  {topClients.maiorMedia?.cliente?.nome || 'N/A'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {topClients.maiorMedia?.cliente?.email || 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{
              bgcolor: 'success.light',
              color: 'white',
              height: '100%'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <CalendarIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Maior Frequência
                  </Typography>
                </Box>
                <Typography variant="h4" gutterBottom>
                  {topClients.maiorFrequencia?.diasUnicos || 0} dias
                </Typography>
                <Typography variant="body1">
                  {topClients.maiorFrequencia?.cliente?.nome || 'N/A'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {topClients.maiorFrequencia?.cliente?.email || 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Resumo das vendas */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Resumo das Vendas
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="primary">
                {dailyStats.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dias com Vendas
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="secondary">
                R$ {dailyStats.reduce((total, stat) => total + stat.total, 0).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Geral
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="success.main">
                R$ {(dailyStats.reduce((total, stat) => total + stat.total, 0) / dailyStats.length || 0).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Média por Dia
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="warning.main">
                {Math.max(...dailyStats.map(stat => stat.total), 0).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Maior Venda (R$)
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Stats; 