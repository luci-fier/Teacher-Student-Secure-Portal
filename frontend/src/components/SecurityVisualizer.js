import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Lock,
  LockOpen,
  CompareArrows,
  ContentCopy as CopyIcon,
  Refresh as ResetIcon,
  ArrowForward,
  ArrowBack,
} from '@mui/icons-material';
import { FiberManualRecord } from '@mui/icons-material';

const DataDisplay = ({ title, data, isEncrypted, onCopy }) => (
  <Card sx={{ 
    bgcolor: '#ffffff',
    border: '1px solid #e0e0e0',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  }}>
    <CardContent sx={{ flex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isEncrypted ? <Lock sx={{ color: 'primary.main' }} /> : <LockOpen sx={{ color: 'primary.main' }} />}
          <Typography variant="h6" sx={{ color: 'primary.main' }}>
            {title}
          </Typography>
        </Box>
        {onCopy && (
          <Tooltip title="Copy to clipboard">
            <IconButton onClick={onCopy} size="small" sx={{ color: 'primary.main' }}>
              <CopyIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <TextField
        multiline
        fullWidth
        rows={4}
        value={data}
        InputProps={{
          readOnly: true,
          sx: {
            fontFamily: isEncrypted ? 'monospace' : 'inherit',
            color: '#000000',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(26, 35, 126, 0.23)'
            }
          }
        }}
      />
    </CardContent>
  </Card>
);

const AESRoundVisualizer = ({ active, data, state }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const bytes = data ? Array.from(data) : Array(16).fill(0);
  
  const transformations = [
    {
      label: 'UTF-8 Encoding',
      data: bytes,
      description: 'The input text is converted to bytes using UTF-8 encoding. Each character becomes one or more bytes.',
      details: [
        'Each character is mapped to its UTF-8 byte representation',
        'ASCII characters (like A-Z) use 1 byte (00-7F)',
        'Special characters may use 2-4 bytes',
        'The bytes are arranged in a 4x4 grid (16 bytes per block)'
      ]
    },
    {
      label: 'Add IV',
      data: state.iv ? Array.from(state.iv) : Array(16).fill(0),
      description: 'A random Initialization Vector (IV) is XORed with the first block of data.',
      details: [
        'IV is 16 random bytes generated for each encryption',
        'Ensures identical messages encrypt differently',
        'First block is XORed with IV before encryption',
        'IV is stored with ciphertext for decryption'
      ]
    },
    {
      label: 'Round 1/10',
      data: bytes.map(b => (b + 0x63) % 256),
      description: 'First of 10 AES rounds. Each round applies 4 transformations.',
      details: [
        'SubBytes: Each byte is replaced using an S-box lookup',
        'ShiftRows: Rows are shifted left by 0,1,2,3 positions',
        'MixColumns: Columns undergo matrix multiplication',
        'AddRoundKey: Block is XORed with round key'
      ]
    },
    {
      label: 'Final Round',
      data: state.encryptedText ? 
        Array.from(Uint8Array.from(atob(state.encryptedText.slice(0, 16)), c => c.charCodeAt(0))) :
        Array(16).fill(0),
      description: 'The final round omits MixColumns transformation.',
      details: [
        'Similar to regular rounds but without MixColumns',
        'Ensures encryption is reversible',
        'Produces the final encrypted block',
        'Output is raw encrypted bytes'
      ]
    },
    {
      label: 'Base64 Encoding',
      data: state.encryptedText ? 
        Array.from(state.encryptedText.slice(0, 16).split('').map(c => c.charCodeAt(0))) :
        Array(16).fill(0),
      description: 'The encrypted bytes are encoded as Base64 for safe transmission.',
      details: [
        'Converts binary data to printable ASCII characters',
        'Uses A-Z, a-z, 0-9, +, / and = for padding',
        'Every 3 bytes become 4 Base64 characters',
        'Makes the encrypted data safe to transmit'
      ]
    }
  ];

  useEffect(() => {
    setCurrentStep(0);
  }, [state.encryptedText]);

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, transformations.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const BlockGrid = ({ data, highlight, isBase64 }) => {
    const safeData = Array.isArray(data) ? data : Array(16).fill(0);
    
    return (
      <Box 
        component={motion.div}
        animate={{ opacity: highlight ? 1 : 0.5 }}
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: 1,
          position: 'relative'
        }}
      >
        {safeData.map((byte, i) => (
          <Box
            key={i}
            component={motion.div}
            initial={{ scale: 0.8 }}
            animate={{ 
              scale: highlight ? 1 : 0.8,
              backgroundColor: highlight ? 'rgba(100, 255, 218, 0.1)' : 'transparent'
            }}
            sx={{
              aspectRatio: '1',
              border: '1px solid rgba(100, 255, 218, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8892b0',
              fontSize: '0.8rem',
              fontFamily: 'monospace'
            }}
          >
            {isBase64 ? 
              String.fromCharCode(byte) :
              byte.toString(16).padStart(2, '0')}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          onClick={handlePrev}
          disabled={currentStep === 0}
          startIcon={<ArrowBack />}
          sx={{
            color: '#64ffda',
            borderColor: 'rgba(100, 255, 218, 0.3)',
            '&:hover': { borderColor: '#64ffda' }
          }}
        >
          Previous Step
        </Button>
        <Typography sx={{ color: '#64ffda' }}>
          Step {currentStep + 1} of {transformations.length}
        </Typography>
        <Button
          onClick={handleNext}
          disabled={currentStep === transformations.length - 1}
          endIcon={<ArrowForward />}
          sx={{
            color: '#64ffda',
            borderColor: 'rgba(100, 255, 218, 0.3)',
            '&:hover': { borderColor: '#64ffda' }
          }}
        >
          Next Step
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            bgcolor: '#1a237e',
            border: '1px solid rgba(100, 255, 218, 0.1)',
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#64ffda', mb: 2 }}>
                {transformations[currentStep].label}
              </Typography>
              <BlockGrid 
                data={transformations[currentStep].data}
                highlight={true}
                isBase64={currentStep === transformations.length - 1}
              />
              <Typography variant="body1" sx={{ color: '#8892b0', mt: 3 }}>
                {transformations[currentStep].description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            bgcolor: 'white',
            border: '1px solid rgba(100, 255, 218, 0.1)',
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'black', mb: 2 }}>
                Details
              </Typography>
              <List>
                {transformations[currentStep].details.map((detail, i) => (
                  <ListItem key={i} sx={{ color: 'black', py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <FiberManualRecord sx={{ color: 'black', fontSize: 8 }} />
                    </ListItemIcon>
                    <ListItemText primary={detail} sx={{ color: '#64ffda !important' }} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// eslint-disable-next-line no-unused-vars
const CBCModeVisualizer = ({ active, blocks }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="subtitle2" sx={{ color: '#64ffda', mb: 2 }}>
      CBC Mode Operation
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, overflowX: 'auto', pb: 2 }}>
      {/* Add CBC mode visualization here */}
    </Box>
  </Box>
);

const TechnicalDetails = ({ state, inputText }) => (
  <Card sx={{ bgcolor: 'rgba(10, 25, 47, 0.7)', border: '1px solid rgba(100, 255, 218, 0.1)' }}>
    <CardContent>
      <Typography variant="h6" sx={{ color: '#64ffda', mb: 3 }}>
        AES Encryption Process Visualization
      </Typography>
      
      <AESRoundVisualizer 
        active={true}
        data={inputText ? new TextEncoder().encode(inputText.slice(0, 16)) : null}
        state={state}
      />
    </CardContent>
  </Card>
);

const SecurityVisualizer = () => {
  const [inputText, setInputText] = useState('');
  const [state, setState] = useState({
    encryptedText: '',
    decryptedText: '',
    key: null,
    iv: null,
    isProcessing: false
  });

  const handleEncrypt = async () => {
    if (!inputText) return;
    
    try {
      setState(prev => ({ ...prev, isProcessing: true }));

      // Generate encryption key and IV
      const iv = crypto.getRandomValues(new Uint8Array(16));
      const key = await crypto.subtle.generateKey(
        { name: 'AES-CBC', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );

      // Encrypt the text
      const encoder = new TextEncoder();
      const encodedText = encoder.encode(inputText);
      const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv },
        key,
        encodedText
      );

      // Convert to base64 for display
      const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedData)));

      setState(prev => ({
        ...prev,
        encryptedText: encryptedBase64,
        key,
        iv,
        decryptedText: '',
        isProcessing: false
      }));
    } catch (error) {
      console.error('Encryption error:', error);
    }
  };

  const handleDecrypt = async () => {
    try {
      setState(prev => ({ ...prev, isProcessing: true }));

      const encryptedData = Uint8Array.from(atob(state.encryptedText), c => c.charCodeAt(0));
      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: state.iv },
        state.key,
        encryptedData
      );

      const decoder = new TextDecoder();
      const decryptedText = decoder.decode(decryptedData);

      setState(prev => ({
        ...prev,
        decryptedText,
        isProcessing: false
      }));
    } catch (error) {
      console.error('Decryption error:', error);
    }
  };

  const handleReset = () => {
    setInputText('');
    setState({
      encryptedText: '',
      decryptedText: '',
      key: null,
      iv: null,
      isProcessing: false
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Paper sx={{ p: 4, bgcolor: '#ffffff' }}>
      <Typography variant="h5" sx={{ color: '#1a237e', mb: 4 }}>
        Interactive Encryption Demo
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ bgcolor: '#ffffff', border: '1px solid #e0e0e0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Enter text to encrypt"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  InputProps={{
                    sx: {
                      color: '#000000',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(26, 35, 126, 0.23)'
                      }
                    }
                  }}
                  InputLabelProps={{
                    sx: { color: '#1a237e' }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleEncrypt}
                  disabled={!inputText || state.isProcessing}
                  startIcon={<Lock />}
                  sx={{
                    bgcolor: '#1a237e',
                    color: '#ffffff',
                    '&:hover': {
                      bgcolor: '#000051',
                    },
                    '&:disabled': {
                      bgcolor: '#e0e0e0',
                    }
                  }}
                >
                  Encrypt
                </Button>
                <Tooltip title="Reset">
                  <IconButton onClick={handleReset} sx={{ color: '#1a237e' }}>
                    <ResetIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <DataDisplay
            title="Original Text"
            data={inputText}
            isEncrypted={false}
            onCopy={() => copyToClipboard(inputText)}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <DataDisplay
            title="Encrypted Text"
            data={state.encryptedText}
            isEncrypted={true}
            onCopy={() => copyToClipboard(state.encryptedText)}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <DataDisplay
            title="Decrypted Text"
            data={state.decryptedText || 'Click decrypt to reveal the original text'}
            isEncrypted={false}
            onCopy={state.decryptedText ? () => copyToClipboard(state.decryptedText) : null}
          />
        </Grid>

        <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            variant="outlined"
            onClick={handleDecrypt}
            disabled={!state.encryptedText || state.isProcessing}
            startIcon={<CompareArrows />}
            sx={{
              color: '#1a237e',
              borderColor: '#1a237e',
              '&:hover': {
                borderColor: '#1a237e',
                background: 'rgba(26, 35, 126, 0.1)'
              }
            }}
          >
            Decrypt Text
          </Button>
        </Grid>

        <Grid item xs={12}>
          <TechnicalDetails state={state} inputText={inputText} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SecurityVisualizer; 