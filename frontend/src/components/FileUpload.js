import { useState } from 'react';
import {
  Button,
  Box,
  Typography,
  Alert,
  LinearProgress,
  CircularProgress,
  Fade
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Lock as LockIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3000/api';

function FileUpload({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [encrypting, setEncrypting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setEncrypting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Simulate encryption process
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEncrypting(false);
      
      await response.json();
      setSuccess(true);
      if (onUploadComplete) {
        onUploadComplete();
      }
      event.target.value = '';
    } catch (err) {
      setError('Failed to upload file');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <input
        type="file"
        id="file-upload"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
        disabled={uploading}
      />
      
      <label htmlFor="file-upload">
        <Button
          component="span"
          variant="contained"
          startIcon={
            encrypting ? (
              <SecurityIcon className="encrypting-icon" />
            ) : uploading ? (
              <CircularProgress size={20} />
            ) : (
              <UploadIcon />
            )
          }
          disabled={uploading}
          fullWidth
          sx={{
            position: 'relative',
            '& .encrypting-icon': {
              animation: 'pulse 1.5s infinite'
            },
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)', opacity: 1 },
              '50%': { transform: 'scale(1.2)', opacity: 0.7 },
              '100%': { transform: 'scale(1)', opacity: 1 }
            }
          }}
        >
          {encrypting ? 'Encrypting...' : uploading ? 'Uploading...' : 'Choose File'}
        </Button>
      </label>

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          File encrypted and uploaded successfully!
        </Alert>
      )}

      {encrypting && (
        <Fade in={encrypting}>
          <Box sx={{ 
            mt: 2, 
            display: 'flex', 
            alignItems: 'center',
            gap: 1,
            color: 'primary.main' 
          }}>
            <LockIcon />
            <Typography variant="body2">
              Encrypting your file for secure storage...
            </Typography>
          </Box>
        </Fade>
      )}

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1 }}>
            {encrypting ? 'Encrypting...' : 'Uploading...'}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default FileUpload; 