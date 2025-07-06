import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Chip,
  LinearProgress,
  Tooltip,
  Alert
} from '@mui/material';
import {
  CloudDownload as DownloadIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3000/api';

function FileDownload() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchFiles = useCallback(async () => {
    try {
      if (!user?.token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_URL}/files/shared`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch available files');
      }

      const data = await response.json();
      setFiles(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError(err.message || 'Failed to fetch files');
      setFiles([]); // Reset files on error
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user, fetchFiles]);

  const handleDownload = async (filename) => {
    try {
      console.log('Attempting to download:', filename);
      
      const response = await fetch(`${API_URL}/download/${filename}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Download failed');
      }

      const blob = await response.blob();
      console.log('Download successful, blob size:', blob.size);
      
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
      // Show error to user
      setError(error.message || 'Failed to download file');
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Available Files
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>File Name</TableCell>
                <TableCell>Uploaded By</TableCell>
                <TableCell>Upload Date</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <LinearProgress />
                  </TableCell>
                </TableRow>
              ) : files.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No files available
                  </TableCell>
                </TableRow>
              ) : (
                files.map((file) => (
                  <TableRow key={file._id} hover>
                    <TableCell>{file.originalname}</TableCell>
                    <TableCell>{file.uploadedBy.name}</TableCell>
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
    </Box>
  );
}

export default FileDownload; 