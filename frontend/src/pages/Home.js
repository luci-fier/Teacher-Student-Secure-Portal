import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3
        }}
      >
        <Typography variant="h3" component="h1" align="center">
          Welcome to Student-Teacher Portal
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary">
          A platform for seamless file sharing between teachers and students
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/teacher-dashboard')}
            sx={{ mr: 2 }}
          >
            Teacher Dashboard
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/student-dashboard')}
          >
            Student Dashboard
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Home; 