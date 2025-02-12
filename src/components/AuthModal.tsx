import React from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography, Button } from '@mui/material';
import GoogleButton from 'react-google-button';
import { signInWithGoogle } from '../services/auth';
import { Link } from 'react-router-dom';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
      onClose={onClose}
    >
      <DialogTitle sx={{ textAlign: 'center' }}>Bienvenido a Cuentas</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, p: 2 }}>
          <Typography variant="body1" align="center" gutterBottom>
            Para utilizar esta aplicación es necesario iniciar sesión con tu cuenta de Google.
            Esto nos permite mantener tus datos seguros y sincronizados.
          </Typography>

          <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
            Al iniciar sesión podrás:
          </Typography>

          <Box sx={{ width: '100%', pl: 2 }}>
            <Typography variant="body2" gutterBottom>• Registrar tus ingresos y gastos</Typography>
            <Typography variant="body2" gutterBottom>• Crear y gestionar categorías personalizadas</Typography>
            <Typography variant="body2" gutterBottom>• Ver reportes mensuales de tus finanzas</Typography>
            <Typography variant="body2" gutterBottom>• Analizar tus hábitos financieros con gráficos</Typography>
          </Box>

          <GoogleButton onClick={handleGoogleSignIn} />

          <Button
            component={Link}
            to="/about"
            color="primary"
            sx={{ mt: 2 }}
          >
            Conocer más sobre el proyecto
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal; 