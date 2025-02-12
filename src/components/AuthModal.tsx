import React from 'react';
import { Dialog, DialogTitle, DialogContent, Box } from '@mui/material';
import GoogleButton from 'react-google-button';
import { signInWithGoogle } from '../services/auth';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Iniciar Sesión</DialogTitle>
      <DialogContent>
        <Box display="flex" justifyContent="center" p={2}>
          <GoogleButton onClick={handleGoogleSignIn} />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal; 