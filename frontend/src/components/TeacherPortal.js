import { 
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip
} from '@mui/material';
import {
  CloudDownload as DownloadIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';

const TeacherPortal = () => {
  const files = [
    {
      name: 'Pradip Sah Sonar.pdf',
      uploadDate: 'Feb 28, 2025, 10:59 PM',
      size: '281.11 KB',
      status: 'Protected'
    },
    {
      name: 'Loop statements-exercise.pdf',
      uploadDate: 'Feb 28, 2025, 9:16 PM',
      size: '45.57 KB',
      status: 'Protected'
    },
    {
      name: 'Assignment-3.docx',
      uploadDate: 'Feb 28, 2025, 12:35 AM',
      size: '1808.38 KB',
      status: 'Standard'
    },
    {
      name: 'Thank you.jpg',
      uploadDate: 'Feb 28, 2025, 12:27 AM',
      size: '40.13 KB',
      status: 'Standard'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: '#0A192F',
        color: 'white',
        py: 2,
        px: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography sx={{ color: '#64ffda', fontSize: '1.25rem' }}>
          Teacher Portal
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography sx={{ color: '#8892b0' }}>Welcome, Bikrant</Typography>
          <Typography 
            component="a" 
            href="/logout"
            sx={{ 
              color: '#64ffda',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Logout
          </Typography>
          <Typography 
            component="a" 
            href="/security-demo"
            sx={{ 
              color: '#64ffda',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Security Demo
          </Typography>
        </Box>
      </Box>

      {/* Dashboard Header */}
      <Box sx={{ 
        background: 'linear-gradient(90deg, #2196F3 0%, #E91E63 100%)',
        borderRadius: '20px',
        m: 3,
        p: 4,
        color: 'white'
      }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Teacher Dashboard
        </Typography>
        <Typography>
          Manage and track your educational materials
        </Typography>
      </Box>

      {/* Upload Section */}
      <Box sx={{ 
        mx: 3,
        mb: 4,
        p: 3,
        bgcolor: '#0A192F',
        borderRadius: '10px'
      }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          Upload New File
        </Typography>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          fullWidth
          sx={{
            bgcolor: '#2196F3',
            '&:hover': { bgcolor: '#1976D2' }
          }}
        >
          Choose File
        </Button>
      </Box>

      {/* Files Table */}
      <TableContainer component={Paper} sx={{ mx: 3, boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#0A192F' }}>
              <TableCell sx={{ color: 'white' }}>File Name</TableCell>
              <TableCell sx={{ color: 'white' }}>Upload Date</TableCell>
              <TableCell sx={{ color: 'white' }}>Size</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.name}>
                <TableCell>{file.name}</TableCell>
                <TableCell>{file.uploadDate}</TableCell>
                <TableCell>{file.size}</TableCell>
                <TableCell>
                  <Chip 
                    label={file.status}
                    color={file.status === 'Protected' ? 'error' : 'primary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" sx={{ color: '#2196F3' }}>
                    <InfoIcon />
                  </IconButton>
                  <IconButton size="small" sx={{ color: '#2196F3' }}>
                    <DownloadIcon />
                  </IconButton>
                  <IconButton size="small" sx={{ color: '#E91E63' }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TeacherPortal; 