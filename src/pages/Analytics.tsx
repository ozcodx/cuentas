import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/auth';
import { getTransactionsByDateRange } from '../services/transactions';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics: React.FC = () => {
  const [user] = useAuthState(auth);
  const [timeRange, setTimeRange] = useState(6); // meses
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          const endDate = new Date();
          const startDate = subMonths(startOfMonth(endDate), timeRange - 1);
          const transactions = await getTransactionsByDateRange(user, startDate, endDate);

          // Procesar datos mensuales
          const monthlyStats = new Map();
          transactions.forEach(transaction => {
            const monthKey = format(transaction.date, 'yyyy-MM');
            if (!monthlyStats.has(monthKey)) {
              monthlyStats.set(monthKey, {
                month: format(transaction.date, 'MMM yyyy', { locale: es }),
                income: 0,
                expenses: 0
              });
            }
            const stats = monthlyStats.get(monthKey);
            if (transaction.amount > 0) {
              stats.income += transaction.amount;
            } else {
              stats.expenses += Math.abs(transaction.amount);
            }
          });

          setMonthlyData(Array.from(monthlyStats.values()));

          // Procesar datos por categoría
          const categoryStats = new Map();
          transactions.forEach(transaction => {
            if (!categoryStats.has(transaction.category)) {
              categoryStats.set(transaction.category, 0);
            }
            categoryStats.set(
              transaction.category,
              categoryStats.get(transaction.category) + Math.abs(transaction.amount)
            );
          });

          setCategoryData(
            Array.from(categoryStats.entries()).map(([name, value]) => ({
              name,
              value
            }))
          );
        } catch (error) {
          console.error('Error al cargar datos para análisis:', error);
        }
      }
    };

    loadData();
  }, [user, timeRange]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Análisis y Estadísticas
        </Typography>

        <FormControl sx={{ mb: 4, minWidth: 200 }}>
          <InputLabel>Rango de Tiempo</InputLabel>
          <Select
            value={timeRange}
            label="Rango de Tiempo"
            onChange={(e) => setTimeRange(Number(e.target.value))}
          >
            <MenuItem value={3}>Últimos 3 meses</MenuItem>
            <MenuItem value={6}>Últimos 6 meses</MenuItem>
            <MenuItem value={12}>Último año</MenuItem>
          </Select>
        </FormControl>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Ingresos vs Gastos por Mes
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    name="Ingresos"
                    stroke="#00C49F"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    name="Gastos"
                    stroke="#FF8042"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Distribución por Categorías
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Resumen del Período
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  Total Ingresos: $
                  {monthlyData
                    .reduce((sum, month) => sum + month.income, 0)
                    .toFixed(2)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Total Gastos: $
                  {monthlyData
                    .reduce((sum, month) => sum + month.expenses, 0)
                    .toFixed(2)}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Promedio Mensual Ingresos: $
                  {(
                    monthlyData.reduce((sum, month) => sum + month.income, 0) /
                    monthlyData.length
                  ).toFixed(2)}
                </Typography>
                <Typography variant="body1">
                  Promedio Mensual Gastos: $
                  {(
                    monthlyData.reduce((sum, month) => sum + month.expenses, 0) /
                    monthlyData.length
                  ).toFixed(2)}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Analytics; 