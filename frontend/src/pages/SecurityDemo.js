import { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Box,
  useTheme
} from '@mui/material';
import SecurityVisualizer from '../components/SecurityVisualizer';
import { Upload as UploadIcon, Security as SecurityIcon } from '@mui/icons-material';

function SecurityDemo() {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState(null);
  const [showVisualization, setShowVisualization] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowVisualization(true);
    }
  };

  const handleStartDemo = () => {
    setShowVisualization(true);
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 4 
          }}
        >
          <SecurityIcon sx={{ fontSize: 40, mr: 2, color: theme.palette.primary.main }} />
          <Typography variant="h4" fontWeight="600" color="text.primary">
            Security Visualization Demo
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <Typography variant="h5" sx={{ color: theme.palette.primary.main, mb: 2 }}>
                Interactive Security Demo
              </Typography>
              <Typography sx={{ color: theme.palette.info.main, mb: 4 }}>
                This interactive demo shows how files are encrypted and secured in our vault system.
                You can either upload a real file or use our demo file to see the process in action.
              </Typography>

              <Grid container spacing={2}>
                <Grid item>
                  <input
                    type="file"
                    id="demo-file-upload"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                  />
                  <label htmlFor="demo-file-upload">
                    <Button
                      component="span"
                      variant="contained"
                      startIcon={<UploadIcon />}
                      sx={{
                        py: 1.5,
                        px: 3,
                        borderRadius: 2,
                        fontWeight: 600,
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                        '&:hover': {
                          boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)',
                        }
                      }}
                    >
                      Upload File
                    </Button>
                  </label>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    onClick={handleStartDemo}
                    sx={{
                      py: 1.5,
                      px: 3,
                      borderRadius: 2,
                      fontWeight: 600,
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        borderColor: theme.palette.primary.dark,
                        backgroundColor: 'rgba(33, 150, 243, 0.08)'
                      }
                    }}
                  >
                    Start Demo with Sample File
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            {(showVisualization || selectedFile) && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4,
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 2,
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <SecurityVisualizer
                  file={selectedFile || new File(['Sample text for encryption demo'], 'sample.txt', { type: 'text/plain' })}
                />
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default SecurityDemo; 