import { Box, Typography, Grid, Button, Paper, Container } from '@mui/material';
import TeacherFileManager from '../components/TeacherFileManager';
import { useTheme } from '@mui/material/styles';
import PersonalVault from '../components/PersonalVault';
import { Link } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import DashboardIcon from '@mui/icons-material/Dashboard';

function TeacherDashboard() {
  const theme = useTheme();

  return (
    <Box sx={{ 
      backgroundColor: theme.palette.background.default, 
      minHeight: '100vh', 
      pb: 6 
    }}>
      <Box
        sx={{
          background: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          py: 5,
          px: 4,
          mb: 4,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DashboardIcon sx={{ fontSize: 40, mr: 2, color: theme.palette.primary.contrastText }} />
            <Box>
              <Typography 
                variant="h4" 
                fontWeight="600" 
                gutterBottom 
                color="inherit"
              >
                Teacher Dashboard
              </Typography>
              <Typography 
                variant="subtitle1" 
                color="inherit"
              >
                Manage and track your educational materials
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 8,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.secondary.main}`
              }}
            >
              <TeacherFileManager />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 8,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.secondary.main}`
              }}
            >
              <PersonalVault />
            </Paper>
          </Grid>
        </Grid>

        <Button
          component={Link}
          to="/security-demo"
          variant="contained"
          startIcon={<SecurityIcon />}
          sx={{
            mt: 4,
            py: 1.5,
            px: 3,
            borderRadius: 8,
            fontWeight: 600,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 6px 10px rgba(0,0,0,0.15)',
            }
          }}
        >
          View Security Demo
        </Button>
      </Container>
    </Box>
  );
}

export default TeacherDashboard; 