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
  SelectChangeEvent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

interface TransactionFormProps {
  categories: Array<{ id: string; name: string }>;
  onSubmit: (transaction: any) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ categories, onSubmit }) => {
  const [isExpense, setIsExpense] = useState(true);
  const [formData, setFormData] = useState({
    category: '',
    date: new Date(),
    description: '',
    amount: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: isExpense ? -Number(formData.amount) : Number(formData.amount),
      type: isExpense ? 'expense' : 'income',
      timestamp: new Date(),
    });
    // Limpiar el formulario
    setFormData({
      category: '',
      date: new Date(),
      description: '',
      amount: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: SelectChangeEvent) => {
    setFormData(prev => ({ ...prev, category: e.target.value }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({ ...prev, date }));
    }
  };

  const backgroundColor = isExpense ? '#fff5f5' : '#f5fff5';

  return (
    <Paper elevation={3} sx={{ p: 3, backgroundColor }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" gutterBottom>
          {isExpense ? 'Registrar Gasto' : 'Registrar Ingreso'}
        </Typography>
        
        <Button
          variant="outlined"
          onClick={() => setIsExpense(!isExpense)}
          sx={{ mb: 2 }}
        >
          Cambiar a {isExpense ? 'Ingreso' : 'Gasto'}
        </Button>

        <FormControl fullWidth>
          <InputLabel>Categoría</InputLabel>
          <Select
            value={formData.category}
            label="Categoría"
            onChange={handleCategoryChange}
            required
          >
            {categories.map(category => (
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
          type="number"
          value={formData.amount}
          onChange={handleChange}
          required
          fullWidth
          InputProps={{
            inputProps: { min: 0, step: "0.01" }
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