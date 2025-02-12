import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Typography,
  SelectChangeEvent,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { Category } from '../services/categories';

interface TransactionFormProps {
  categories: Category[];
  onSubmit: (transaction: any) => void;
}

const formatNumber = (num: string) => {
  const number = num.replace(/[^\d]/g, '');
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const unformatNumber = (num: string) => {
  return num.replace(/\./g, '');
};

const TransactionForm: React.FC<TransactionFormProps> = ({ categories, onSubmit }) => {
  const [isExpense, setIsExpense] = useState(true);
  const [formData, setFormData] = useState({
    category: '',
    date: new Date(),
    description: '',
    amount: '',
  });

  const filteredCategories = categories.filter(
    category => category.type === (isExpense ? 'expense' : 'income')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: isExpense ? -Number(unformatNumber(formData.amount)) : Number(unformatNumber(formData.amount)),
      type: isExpense ? 'expense' : 'income',
      timestamp: new Date(),
    });
    setFormData({
      category: '',
      date: new Date(),
      description: '',
      amount: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      setFormData(prev => ({ ...prev, [name]: formatNumber(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryChange = (e: SelectChangeEvent) => {
    setFormData(prev => ({ ...prev, category: e.target.value }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({ ...prev, date }));
    }
  };

  const backgroundColor = isExpense ? '#fff5f5' : '#f8fff8';

  return (
    <Paper elevation={3} sx={{ p: 3, backgroundColor }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          {isExpense ? 'Registrar Gasto' : 'Registrar Ingreso'}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setIsExpense(!isExpense)}
          color={isExpense ? "error" : "success"}
        >
          Cambiar a {isExpense ? 'Ingreso' : 'Gasto'}
        </Button>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Categoría</InputLabel>
          <Select
            value={formData.category}
            label="Categoría"
            onChange={handleCategoryChange}
            required
          >
            {filteredCategories.map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <DatePicker
            label="Fecha"
            value={formData.date}
            onChange={handleDateChange}
            format="dd/MM/yyyy"
          />
        </LocalizationProvider>

        <TextField
          name="description"
          label="Descripción"
          value={formData.description}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          name="amount"
          label="Monto"
          value={formData.amount}
          onChange={handleChange}
          required
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputProps: { min: 0 }
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color={isExpense ? "error" : "success"}
          fullWidth
          sx={{ mt: 2 }}
        >
          Guardar {isExpense ? 'Gasto' : 'Ingreso'}
        </Button>
      </Box>
    </Paper>
  );
};

export default TransactionForm; 