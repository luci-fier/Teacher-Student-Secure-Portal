import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  Lock as LockIcon,
  Delete as DeleteIcon,
  CloudDownload as DownloadIcon,
  Add as AddIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3000/api';

function PersonalVault() {
  const [vaultItems, setVaultItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDetails, setFileDetails] = useState({
    category: 'other',
    description: '',
    tags: []
  });
  const { user } = useAuth();

  const fetchVaultItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/vault/files`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to access vault');
      }

      const data = await response.json();
      setVaultItems(data);
    } catch (error) {
      console.error('Vault error:', error);
      setError('Failed to access vault');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchVaultItems();
    }
  }, [user, fetchVaultItems]);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', fileDetails.category);
    formData.append('description', fileDetails.description);
    formData.append('tags', JSON.stringify(fileDetails.tags));

    setUploading(true);
    try {
      const response = await fetch(`${API_URL}/vault/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload to vault');
      }

      await fetchVaultItems();
      setUploadOpen(false);
      setSelectedFile(null);
      setFileDetails({ category: 'other', description: '', tags: [] });
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload to vault');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await fetch(`${API_URL}/vault/download/${filename}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download from vault');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download from vault');
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/vault/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete from vault');
      }

      setVaultItems(vaultItems.filter(item => item._id !== itemId));
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete from vault');
    }
  };

  return (
    <Box>
      <Paper 
        elevation={4}
        sx={{ 
          p: 3, 
          mb: 3,
          background: 'linear-gradient(135deg, #0a192f 0%, #112240 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(100, 255, 218, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(100, 255, 218, 0.1)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '16px',
            border: '1px solid transparent',
            background: 'linear-gradient(135deg, rgba(100, 255, 218, 0.1), rgba(0, 0, 0, 0))',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          pb: 2,
          borderBottom: '1px solid rgba(100, 255, 218, 0.1)'
        }}>
          <Typography variant="h5" sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            fontWeight: 600,
            color: '#64ffda',
            textShadow: '0 0 10px rgba(100, 255, 218, 0.3)',
          }}>
            <LockIcon sx={{ color: '#64ffda' }} /> Personal Vault
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setUploadOpen(true)}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              px: 3,
              py: 1,
              background: 'linear-gradient(45deg, #0a192f 30%, #112240 90%)',
              border: '1px solid rgba(100, 255, 218, 0.5)',
              color: '#64ffda',
              boxShadow: '0 0 15px rgba(100, 255, 218, 0.2)',
              '&:hover': {
                background: 'linear-gradient(45deg, #112240 30%, #0a192f 90%)',
                boxShadow: '0 0 20px rgba(100, 255, 218, 0.4)',
                transform: 'translateY(-1px)',
                border: '1px solid rgba(100, 255, 218, 0.8)',
              }
            }}
          >
            Add to Vault
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <LinearProgress />
        ) : vaultItems.length === 0 ? (
          <Typography align="center" color="text.secondary">
            Your vault is empty
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {vaultItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card 
                  elevation={3}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    background: 'linear-gradient(135deg, #1a2332 0%, #0a192f 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(100, 255, 218, 0.1)',
                    borderRadius: '12px',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.3), 0 0 15px rgba(100, 255, 218, 0.2)',
                      border: '1px solid rgba(100, 255, 218, 0.3)',
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2, 
                      gap: 1.5,
                      borderBottom: '1px solid rgba(100, 255, 218, 0.1)',
                      pb: 1.5
                    }}>
                      <SecurityIcon sx={{ color: '#64ffda' }} />
                      <Typography variant="subtitle1" 
                        sx={{ 
                          fontWeight: 500,
                          color: '#e6f1ff'
                        }}
                      >
                        {item.originalname}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip 
                        label={item.category} 
                        size="small"
                        sx={{ 
                          background: 'rgba(100, 255, 218, 0.1)',
                          border: '1px solid rgba(100, 255, 218, 0.3)',
                          color: '#64ffda',
                          fontWeight: 500,
                          '&:hover': {
                            background: 'rgba(100, 255, 218, 0.15)',
                          }
                        }}
                      />
                      <Typography variant="body2" 
                        sx={{ color: '#8892b0' }}
                      >
                        {format(new Date(item.uploadDate), 'PPp')}
                      </Typography>
                    </Box>

                    {item.description && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          p: 1.5,
                          borderRadius: '8px',
                          backgroundColor: 'rgba(100, 255, 218, 0.05)',
                          border: '1px solid rgba(100, 255, 218, 0.1)',
                          color: '#8892b0',
                          mb: 2
                        }}
                      >
                        {item.description}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {item.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{ 
                            background: 'rgba(100, 255, 218, 0.05)',
                            border: '1px solid rgba(100, 255, 218, 0.1)',
                            color: '#8892b0',
                            '&:hover': {
                              background: 'rgba(100, 255, 218, 0.1)',
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>

                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'flex-end', 
                      gap: 1, 
                      p: 1.5,
                      borderTop: '1px solid rgba(100, 255, 218, 0.1)',
                      background: 'rgba(10, 25, 47, 0.7)'
                    }}
                  >
                    <Tooltip title="Download">
                      <IconButton
                        size="small"
                        sx={{
                          color: '#8892b0',
                          '&:hover': {
                            color: '#64ffda',
                            background: 'rgba(100, 255, 218, 0.1)'
                          }
                        }}
                        onClick={() => handleDownload(item.filename)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        sx={{
                          color: '#8892b0',
                          '&:hover': {
                            color: '#ff5370',
                            background: 'rgba(255, 83, 112, 0.1)'
                          }
                        }}
                        onClick={() => handleDelete(item._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      <Dialog 
        open={uploadOpen} 
        onClose={() => setUploadOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: '#FFFFFF',
            border: '1px solid #bf0c4f',
            minWidth: '400px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #bf0c4f',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          color: '#bf0c4f',
          pb: 2
        }}>
          <SecurityIcon sx={{ color: '#bf0c4f' }} /> Add to Vault
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ mt: 2 }}>
            <input
              type="file"
              id="vault-file"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            <label htmlFor="vault-file">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                startIcon={<SecurityIcon sx={{ color: '#bf0c4f' }} />}
                sx={{
                  color: '#bf0c4f',
                  borderColor: '#bf0c4f',
                  '&:hover': {
                    borderColor: '#D06168',
                    background: 'rgba(191, 12, 79, 0.1)'
                  }
                }}
              >
                Select File
              </Button>
            </label>
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 1, color: '#000000' }}>
                Selected: {selectedFile.name}
              </Typography>
            )}
          </Box>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel sx={{ color: '#bf0c4f' }}>Category</InputLabel>
            <Select
              value={fileDetails.category}
              onChange={(e) => setFileDetails({ ...fileDetails, category: e.target.value })}
              label="Category"
              sx={{
                color: '#000000',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#bf0c4f'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D06168'
                }
              }}
            >
              <MenuItem value="credentials">Credentials</MenuItem>
              <MenuItem value="research">Research</MenuItem>
              <MenuItem value="academic">Academic</MenuItem>
              <MenuItem value="exam">Exam Materials</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Description"
            value={fileDetails.description}
            onChange={(e) => setFileDetails({ ...fileDetails, description: e.target.value })}
            sx={{ 
              mt: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#bf0c4f'
                },
                '&:hover fieldset': {
                  borderColor: '#D06168'
                }
              },
              '& .MuiInputLabel-root': {
                color: '#bf0c4f'
              }
            }}
          />

          <TextField
            fullWidth
            label="Tags (comma-separated)"
            value={fileDetails.tags.join(', ')}
            onChange={(e) => setFileDetails({
              ...fileDetails,
              tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
            })}
            sx={{ 
              mt: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#bf0c4f'
                },
                '&:hover fieldset': {
                  borderColor: '#D06168'
                }
              },
              '& .MuiInputLabel-root': {
                color: '#bf0c4f'
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setUploadOpen(false)}
            sx={{
              color: '#bf0c4f'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            variant="contained"
            sx={{
              bgcolor: '#bf0c4f',
              color: '#FFFFFF',
              '&:hover': {
                bgcolor: '#D06168'
              }
            }}
          >
            {uploading ? 'Encrypting...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PersonalVault; 