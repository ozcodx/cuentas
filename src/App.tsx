import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, signOut } from './services/auth';
import Home from './pages/Home';
import MonthlyReport from './pages/MonthlyReport';
import Analytics from './pages/Analytics';
import Categories from './pages/Categories';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  const [user] = useAuthState(auth);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      handleClose();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <BrowserRouter>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={handleMenu}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Cuentas
                </Typography>
                {user && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      size="large"
                      color="inherit"
                      onClick={handleLogout}
                    >
                      <LogoutIcon />
                    </IconButton>
                    <IconButton size="large" color="inherit">
                      <AccountCircle />
                    </IconButton>
                  </Box>
                )}
              </Toolbar>
            </AppBar>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                component={Link}
                to="/"
                onClick={handleClose}
              >
                Inicio
              </MenuItem>
              <MenuItem
                component={Link}
                to="/monthly-report"
                onClick={handleClose}
              >
                Reporte Mensual
              </MenuItem>
              <MenuItem
                component={Link}
                to="/analytics"
                onClick={handleClose}
              >
                Análisis
              </MenuItem>
              <MenuItem
                component={Link}
                to="/categories"
                onClick={handleClose}
              >
                Categorías
              </MenuItem>
            </Menu>
          </Box>

          <Container sx={{ mt: 4 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/monthly-report" element={<MonthlyReport />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/categories" element={<Categories />} />
            </Routes>
          </Container>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
