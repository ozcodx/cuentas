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
  Chip,
  IconButton
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/auth';
import { getTransactionsByMonth, updateTransaction, deleteTransaction } from '../services/transactions';
import { getCategories } from '../services/categories';
import type { Transaction } from '../services/transactions';
import type { Category } from '../services/categories';
import TransactionEditModal from '../components/TransactionEditModal';

const MonthlyReport: React.FC = () => {
  const [user] = useAuthState(auth);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0
  });

  useEffect(() => {
    const loadCategories = async () => {
      if (user) {
        try {
          const userCategories = await getCategories(user);
          setCategories(userCategories);
        } catch (error) {
          console.error('Error al cargar categorías:', error);
        }
      }
    };
    loadCategories();
  }, [user]);

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

  useEffect(() => {
    loadTransactions();
  }, [user, selectedDate]);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = async (transactionId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta transacción?')) {
      try {
        await deleteTransaction(transactionId);
        await loadTransactions();
      } catch (error) {
        console.error('Error al eliminar transacción:', error);
      }
    }
  };

  const handleSaveEdit = async (updatedTransaction: Transaction) => {
    try {
      if (updatedTransaction.id) {
        await updateTransaction(updatedTransaction.id, updatedTransaction);
        await loadTransactions();
      }
    } catch (error) {
      console.error('Error al actualizar transacción:', error);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(Math.abs(amount));
  };

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
            defaultValue={new Date()}
            sx={{ mb: 4 }}
          />
        </LocalizationProvider>

        <Box sx={{ mb: 4 }}>
          <Paper sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'space-around' }}>
            <Box>
              <Typography variant="subtitle2">Ingresos</Typography>
              <Typography variant="h6" color="success.main">
                {formatAmount(summary.totalIncome)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">Gastos</Typography>
              <Typography variant="h6" color="error.main">
                {formatAmount(summary.totalExpenses)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">Balance</Typography>
              <Typography
                variant="h6"
                color={summary.balance >= 0 ? 'success.main' : 'error.main'}
              >
                {formatAmount(summary.balance)}
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
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{format(transaction.date, 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={getCategoryName(transaction.category)}
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
                    {formatAmount(transaction.amount)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(transaction)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(transaction.id!)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {editingTransaction && (
          <TransactionEditModal
            open={Boolean(editingTransaction)}
            onClose={() => setEditingTransaction(null)}
            transaction={editingTransaction}
            categories={categories}
            onSave={handleSaveEdit}
          />
        )}
      </Box>
    </Container>
  );
};

export default MonthlyReport; 