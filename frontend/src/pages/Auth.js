import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  MenuItem,
  Tab,
  Tabs,
  useTheme,
  Container,
  Card,
  CardContent,
  styled
} from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd, Login as LoginIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 450,
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  borderRadius: 16,
  overflow: 'hidden',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  height: 48,
  fontSize: '1rem',
  fontWeight: 600,
  borderRadius: 8,
  textTransform: 'none',
  backgroundColor: '#bf0c4f',
  color: '#FFFFFF',
  '&:hover': {
    backgroundColor: '#D06168',
  },
}));

const API_URL = 'http://localhost:3000/api';

function Auth() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login: authLogin, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? 'login' : 'register';
      const response = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isLogin ? {
          email: formData.email,
          password: formData.password,
        } : formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `${isLogin ? 'Login' : 'Registration'} failed`);
      }

      const data = await response.json();
      authLogin(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.background.default,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <StyledCard>
          <Tabs
            value={isLogin ? 0 : 1}
            onChange={(e, newValue) => setIsLogin(newValue === 0)}
            variant="fullWidth"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
            TabIndicatorProps={{
              style: {
                backgroundColor: '#bf0c4f',
                height: 3,
              }
            }}
          >
            <Tab 
              icon={<LoginIcon sx={{ mr: 1 }} />} 
              label="LOGIN" 
              iconPosition="start"
              sx={{ 
                py: 2,
                color: 'text.secondary',
                '&.Mui-selected': { 
                  color: '#bf0c4f',
                  fontWeight: 600,
                }
              }}
            />
            <Tab 
              icon={<PersonAdd sx={{ mr: 1 }} />} 
              label="REGISTER"
              iconPosition="start"
              sx={{ 
                py: 2,
                color: 'text.secondary',
                '&.Mui-selected': { 
                  color: '#bf0c4f',
                  fontWeight: 600,
                }
              }}
            />
          </Tabs>

          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              align="center" 
              sx={{ 
                color: 'text.primary',
                fontWeight: 600,
                mb: 3
              }}
            >
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Typography>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  backgroundColor: 'rgba(208, 97, 104, 0.1)',
                  color: theme.palette.error.main,
                  '& .MuiAlert-icon': {
                    color: theme.palette.error.main
                  }
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  margin="normal"
                  required
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              )}

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                variant="outlined"
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {!isLogin && (
                <TextField
                  select
                  fullWidth
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="teacher">Teacher</MenuItem>
                </TextField>
              )}

              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, py: 1.5 }}
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </StyledButton>
            </form>

            <Typography 
              variant="body2" 
              align="center" 
              sx={{ 
                mt: 2, 
                color: 'text.secondary',
                fontSize: '0.9rem'
              }}
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Button
                color="primary"
                onClick={() => setIsLogin(!isLogin)}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600,
                  p: 0,
                  ml: 0.5,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline'
                  }
                }}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Button>
            </Typography>
          </CardContent>
        </StyledCard>
      </Container>
    </Box>
  );
}

export default Auth; 