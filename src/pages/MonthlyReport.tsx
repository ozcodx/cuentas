import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/auth';
import { getTransactionsByMonth } from '../services/transactions';
import type { Transaction } from '../services/transactions';

const MonthlyReport: React.FC = () => {
  const [user] = useAuthState(auth);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0
  });

  useEffect(() => {
    const loadTransactions = async () => {
      if (user) {
        try {
          const monthlyTransactions = await getTransactionsByMonth(user, selectedDate);
          setTransactions(monthlyTransactions);
          
          const totals = monthlyTransactions.reduce(
            (acc, transaction) => {
              if (transaction.amount > 0) {
                acc.totalIncome += transaction.amount;
              } else {
                acc.totalExpenses += Math.abs(transaction.amount);
              }
              return acc;
            },
            { totalIncome: 0, totalExpenses: 0 }
          );

          setSummary({
            ...totals,
            balance: totals.totalIncome - totals.totalExpenses
          });
        } catch (error) {
          console.error('Error al cargar transacciones:', error);
        }
      }
    };

    loadTransactions();
  }, [user, selectedDate]);

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Reporte Mensual
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <DatePicker
            label="Seleccionar Mes"
            value={selectedDate}
            onChange={(newDate) => newDate && setSelectedDate(newDate)}
            views={['year', 'month']}
            sx={{ mb: 4 }}
          />
        </LocalizationProvider>

        <Box sx={{ mb: 4 }}>
          <Paper sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'space-around' }}>
            <Box>
              <Typography variant="subtitle2">Ingresos</Typography>
              <Typography variant="h6" color="success.main">
                ${summary.totalIncome.toFixed(2)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">Gastos</Typography>
              <Typography variant="h6" color="error.main">
                ${summary.totalExpenses.toFixed(2)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">Balance</Typography>
              <Typography
                variant="h6"
                color={summary.balance >= 0 ? 'success.main' : 'error.main'}
              >
                ${summary.balance.toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell align="right">Monto</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{format(transaction.date, 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.category}
                      color={transaction.amount >= 0 ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: transaction.amount >= 0 ? 'success.main' : 'error.main',
                    }}
                  >
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default MonthlyReport; 