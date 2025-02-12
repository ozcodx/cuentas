import React from 'react';
import { Container, Box, Typography, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Sobre Cuentas
          </Typography>

          <Typography variant="body1" paragraph>
            Cuentas es una aplicación web diseñada para ayudarte a gestionar tus finanzas personales
            de manera simple y efectiva. Con una interfaz intuitiva y herramientas poderosas,
            podrás llevar un registro detallado de tus ingresos y gastos.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Características Principales
          </Typography>

          <Box component="ul" sx={{ pl: 3 }}>
            <Typography component="li" paragraph>
              Registro de Transacciones: Añade fácilmente tus ingresos y gastos con categorías
              personalizables.
            </Typography>
            <Typography component="li" paragraph>
              Categorías Personalizadas: Crea y gestiona categorías con colores para organizar
              mejor tus finanzas.
            </Typography>
            <Typography component="li" paragraph>
              Reportes Mensuales: Visualiza un resumen detallado de tus movimientos financieros
              mes a mes.
            </Typography>
            <Typography component="li" paragraph>
              Análisis Gráfico: Comprende mejor tus hábitos financieros con gráficos intuitivos
              y estadísticas.
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Seguridad
          </Typography>

          <Typography variant="body1" paragraph>
            La aplicación utiliza Firebase de Google como backend, garantizando:
          </Typography>

          <Box component="ul" sx={{ pl: 3 }}>
            <Typography component="li" paragraph>
              Autenticación segura a través de Google
            </Typography>
            <Typography component="li" paragraph>
              Almacenamiento encriptado de datos
            </Typography>
            <Typography component="li" paragraph>
              Acceso exclusivo a tus propios datos
            </Typography>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              component={Link}
              to="/"
              variant="contained"
              color="primary"
              size="large"
            >
              Comenzar a Usar
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default About; 