import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:3000/api';

const SecurityDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/security/logs`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch security logs');
      }

      const data = await response.json();
      
      // If no logs exist, show sample data
      if (data.length === 0) {
        setLogs([
          {
            _id: '1',
            timestamp: new Date(),
            event: 'Sample Upload',
            user: 'Demo User',
            status: 'success',
            details: 'Example of a successful file upload',
            ipAddress: '192.168.1.1'
          },
          {
            _id: '2',
            timestamp: new Date(),
            event: 'Sample Download',
            user: 'Demo User',
            status: 'error',
            details: 'Example of a failed download attempt',
            ipAddress: '192.168.1.1'
          }
        ]);
      } else {
        setLogs(data);
      }
    } catch (error) {
      console.error('Error fetching security logs:', error);
      setError('Failed to fetch security logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Paper sx={{ 
      p: 3,
      background: 'linear-gradient(135deg, #0a192f 0%, #112240 100%)',
      border: '1px solid rgba(100, 255, 218, 0.1)',
      borderRadius: 2,
      mb: 3
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Typography variant="h6" sx={{ color: '#64ffda' }}>
          Security Activity Log
        </Typography>
        <Tooltip title="Refresh">
          <IconButton 
            onClick={fetchLogs}
            sx={{ 
              color: '#64ffda',
              '&:hover': {
                background: 'rgba(100, 255, 218, 0.1)'
              }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert 
          severity="info" 
          sx={{ mb: 2 }}
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={() => setError(null)}
            >
              <RefreshIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error} - Showing sample data
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress sx={{ color: '#64ffda' }} />
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#8892b0' }}>Timestamp</TableCell>
                <TableCell sx={{ color: '#8892b0' }}>Event</TableCell>
                <TableCell sx={{ color: '#8892b0' }}>User</TableCell>
                <TableCell sx={{ color: '#8892b0' }}>Status</TableCell>
                <TableCell sx={{ color: '#8892b0' }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log, index) => (
                <TableRow 
                  key={log._id || index}
                  component={motion.tr}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <TableCell sx={{ color: '#8892b0' }}>
                    {format(new Date(log.timestamp), 'PPp')}
                  </TableCell>
                  <TableCell sx={{ color: '#8892b0' }}>
                    {log.event}
                  </TableCell>
                  <TableCell sx={{ color: '#8892b0' }}>
                    {log.user}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.status}
                      size="small"
                      icon={log.status === 'success' ? <SuccessIcon /> : <ErrorIcon />}
                      sx={{
                        bgcolor: log.status === 'success' 
                          ? 'rgba(100, 255, 218, 0.1)' 
                          : 'rgba(255, 83, 112, 0.1)',
                        color: log.status === 'success' ? '#64ffda' : '#ff5370'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#8892b0' }}>
                    {log.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default SecurityDashboard; 