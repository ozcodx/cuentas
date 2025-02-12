import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, signOut } from './services/auth';
import Home from './pages/Home';
import MonthlyReport from './pages/MonthlyReport';
import Analytics from './pages/Analytics';
import Categories from './pages/Categories';
import About from './pages/About';
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

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();

  if (loading) {
    return <Box>Cargando...</Box>;
  }

  if (!user && location.pathname !== '/about') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const [user] = useAuthState(auth);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleProfileOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      handleProfileClose();
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
                {user && (
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={handleMenuOpen}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Cuentas
                </Typography>
                {user && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      onClick={handleProfileOpen}
                      size="large"
                      color="inherit"
                      sx={{ ml: 2 }}
                    >
                      <Avatar
                        alt={user.displayName || ''}
                        src={user.photoURL || ''}
                        sx={{ width: 32, height: 32 }}
                      />
                    </IconButton>
                  </Box>
                )}
              </Toolbar>
            </AppBar>

            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                component={Link}
                to="/"
                onClick={handleMenuClose}
              >
                Inicio
              </MenuItem>
              <MenuItem
                component={Link}
                to="/monthly-report"
                onClick={handleMenuClose}
              >
                Reporte Mensual
              </MenuItem>
              <MenuItem
                component={Link}
                to="/analytics"
                onClick={handleMenuClose}
              >
                Análisis
              </MenuItem>
              <MenuItem
                component={Link}
                to="/categories"
                onClick={handleMenuClose}
              >
                Categorías
              </MenuItem>
              <MenuItem
                component={Link}
                to="/about"
                onClick={handleMenuClose}
              >
                Acerca de
              </MenuItem>
            </Menu>

            <Menu
              anchorEl={profileAnchorEl}
              open={Boolean(profileAnchorEl)}
              onClose={handleProfileClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {user?.displayName && (
                <MenuItem disabled>
                  Sesión iniciada como {user.displayName}
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>

          <Container sx={{ mt: 4 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/monthly-report"
                element={
                  <ProtectedRoute>
                    <MonthlyReport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute>
                    <Categories />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Container>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
