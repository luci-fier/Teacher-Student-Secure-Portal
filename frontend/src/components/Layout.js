import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="static"
        sx={{
          background: 'linear-gradient(135deg, #0a192f 0%, #112240 100%)',
          borderBottom: '1px solid rgba(100, 255, 218, 0.1)'
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#64ffda' }}>
            {user?.role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ color: '#8892b0' }}>
              Welcome, {user?.name}
            </Typography>
            <Button 
              color="inherit" 
              onClick={handleLogout}
              sx={{
                color: '#64ffda',
                borderColor: 'rgba(100, 255, 218, 0.3)',
                '&:hover': {
                  borderColor: '#64ffda',
                  background: 'rgba(100, 255, 218, 0.1)'
                }
              }}
            >
              Logout
            </Button>
            <Button 
              component={Link}
              to="/security-demo"
              sx={{
                color: '#64ffda',
                borderColor: 'rgba(100, 255, 218, 0.3)',
                '&:hover': {
                  borderColor: '#64ffda',
                  background: 'rgba(100, 255, 218, 0.1)'
                }
              }}
            >
              Security Demo
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

export default Layout; 