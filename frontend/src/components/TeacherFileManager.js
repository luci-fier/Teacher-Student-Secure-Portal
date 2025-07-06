import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip,
  LinearProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  CloudDownload as DownloadIcon,
  Assessment as StatsIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import FileUpload from './FileUpload';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000/api';

function TeacherFileManager() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchFiles = useCallback(async () => {
    try {
      if (!user?.token) {
        throw new Error('No authentication token');
      }

      console.log('Using token:', user.token);

      const response = await fetch(`${API_URL}/files`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch files');
      }

      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
      if (error.message === 'No authentication token') {
        logout();
        navigate('/auth');
      }
    } finally {
      setLoading(false);
    }
  }, [user, logout, navigate]);

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user, fetchFiles]);

  const handleDownload = async (filename) => {
    try {
      const response = await fetch(`${API_URL}/download/${filename}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const FileStats = ({ file }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          File Details
        </Typography>
        <Typography>Name: {file.originalname}</Typography>
        <Typography>Size: {(file.size / 1024).toFixed(2)} KB</Typography>
        <Typography>
          Uploaded: {format(new Date(file.uploadDate), 'PPp')}
        </Typography>
        <Typography>
          Status: {file.watermarked ? 'Protected' : 'Standard'}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={selectedFile ? 8 : 12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shared Files
            </Typography>
            <FileUpload onUploadComplete={fetchFiles} />
            <TableContainer sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>File Name</TableCell>
                    <TableCell>Upload Date</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <LinearProgress />
                      </TableCell>
                    </TableRow>
                  ) : files.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No files uploaded yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    files.map((file) => (
                      <TableRow key={file._id} hover>
                        <TableCell>{file.originalname}</TableCell>
                        <TableCell>
                          {format(new Date(file.uploadDate), 'PPp')}
                        </TableCell>
                        <TableCell>
                          {(file.size / 1024).toFixed(2)} KB
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={file.watermarked ? 'Protected' : 'Standard'}
                            color={file.watermarked ? 'secondary' : 'primary'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Stats">
                            <IconButton
                              onClick={() => setSelectedFile(file)}
                              color="primary"
                              size="small"
                            >
                              <StatsIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton
                              onClick={() => handleDownload(file.filename)}
                              color="primary"
                              size="small"
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          {selectedFile && <FileStats file={selectedFile} />}
        </Grid>
      </Grid>
    </Box>
  );
}

export default TeacherFileManager; 