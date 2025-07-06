import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import FileUpload from './FileUpload';
import FileDownload from './FileDownload';
import { logout } from '../services/authService';

function Dashboard({ user, onLogout }) {
  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {user.role === 'teacher' ? 'Teacher Dashboard' : 'Student Dashboard'}
          </Typography>
          <Typography sx={{ mr: 2 }}>
            Welcome, {user.name}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        {user.role === 'teacher' ? (
          <FileUpload />
        ) : (
          <FileDownload />
        )}
      </Box>
    </Box>
  );
}

export default Dashboard; 