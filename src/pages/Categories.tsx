import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/auth';
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  type Category
} from '../services/categories';

interface CategoryFormData {
  name: string;
  type: 'expense' | 'income' | 'both';
  color?: string;
}

const Categories: React.FC = () => {
  const [user] = useAuthState(auth);
  const [categories, setCategories] = useState<Category[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    type: 'expense'
  });

  useEffect(() => {
    loadCategories();
  }, [user]);

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

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        type: category.type,
        color: category.color
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        type: 'expense'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      type: 'expense'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id!, {
          ...formData,
          userId: user.uid
        });
      } else {
        await addCategory({
          ...formData,
          userId: user.uid
        });
      }
      await loadCategories();
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      try {
        await deleteCategory(categoryId);
        await loadCategories();
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
      }
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'expense':
        return 'error';
      case 'income':
        return 'success';
      default:
        return 'primary';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'expense':
        return 'Gasto';
      case 'income':
        return 'Ingreso';
      default:
        return 'Ambos';
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Categorías</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
          >
            Nueva Categoría
          </Button>
        </Box>

        <Paper>
          <List>
            {categories.map((category) => (
              <ListItem key={category.id} divider>
                <ListItemText
                  primary={category.name}
                  secondary={
                    <Chip
                      label={getTypeLabel(category.type)}
                      color={getTypeColor(category.type)}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleOpenDialog(category)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(category.id!)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <form onSubmit={handleSubmit}>
            <DialogTitle>
              {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                <TextField
                  label="Nombre"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  fullWidth
                />
                <FormControl fullWidth required>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={formData.type}
                    label="Tipo"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as 'expense' | 'income' | 'both'
                      })
                    }
                  >
                    <MenuItem value="expense">Gasto</MenuItem>
                    <MenuItem value="income">Ingreso</MenuItem>
                    <MenuItem value="both">Ambos</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Color (opcional)"
                  value={formData.color || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  fullWidth
                  placeholder="#000000"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancelar</Button>
              <Button type="submit" variant="contained" color="primary">
                Guardar
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Categories; 