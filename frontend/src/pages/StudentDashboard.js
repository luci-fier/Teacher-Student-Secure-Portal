import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import FileDownload from '../components/FileDownload';
import PersonalVault from '../components/PersonalVault';
import { useTheme } from '@mui/material/styles';

function StudentDashboard() {
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
          <Typography 
            variant="h4" 
            gutterBottom 
            color="inherit"
          >
            Student Dashboard
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="inherit"
          >
            Access and download your learning materials
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4,
            borderRadius: 8,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.secondary.main}`
          }}
        >
          <FileDownload />
        </Paper>

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
      </Container>
    </Box>
  );
}

export default StudentDashboard; 