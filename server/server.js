const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Constants
const JWT_SECRET = 'your-secret-key';
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const ENCRYPTED_DIR = path.join(__dirname, 'encrypted');
const ENCRYPTION_KEY = crypto.scryptSync('your-secure-password', 'salt', 32);
const IV_LENGTH = 16;
const ALGORITHM = 'aes-256-cbc';

// Debug middleware - log all incoming requests
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body
  });
  next();
});

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    res.status(200).end();
    return;
  }
  next();
});

app.use(express.json());

// Create directories if they don't exist
[UPLOAD_DIR, ENCRYPTED_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    console.log(`Created directory: ${dir}`);
  }
});

// Add this before your routes to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    query: req.query,
    params: req.params,
    body: req.body
  });
  next();
});

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/fileStorage', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Models
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['teacher', 'student'] }
});

const FileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  uploadDate: { type: Date, default: Date.now },
  size: Number,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contentType: String,
  path: String,
  originalPath: String,
  iv: String,
  watermarked: Boolean,
  accessLog: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: String,
    timestamp: Date,
    ipAddress: String
  }]
});

const VaultItemSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  uploadDate: { type: Date, default: Date.now },
  size: Number,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contentType: String,
  path: String,
  iv: String,
  category: {
    type: String,
    enum: ['credentials', 'research', 'academic', 'exam', 'other'],
    default: 'other'
  },
  description: String,
  tags: [String],
  lastAccessed: Date
});

const SecurityLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  event: String,
  user: String,
  status: String,
  details: String,
  ipAddress: String
});

const User = mongoose.model('User', UserSchema);
const File = mongoose.model('File', FileSchema);
const VaultItem = mongoose.model('VaultItem', VaultItemSchema);
const SecurityLog = mongoose.model('SecurityLog', SecurityLogSchema);

// Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Authentication Middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(403).json({ message: 'User not found' });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
};

// Utility Functions
const encryptFile = (buffer) => {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return { 
      iv: iv.toString('hex'),
      encryptedData: encrypted 
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
};

const decryptFile = (encryptedData, ivHex) => {
  try {
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};

// Routes
// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      await logSecurityEvent(
        'Login Attempt',
        null,
        'error',
        `Failed login attempt for email: ${email}`,
        req.ip
      );
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      await logSecurityEvent(
        'Login Attempt',
        user,
        'error',
        'Invalid password',
        req.ip
      );
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    await logSecurityEvent(
      'Login',
      user,
      'success',
      'User logged in successfully',
      req.ip
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// File Routes
app.post('/api/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const timestamp = Date.now();
    const filename = `${timestamp}-encrypted-${Math.floor(Math.random() * 10000000000)}.pdf`;
    const filepath = path.join(ENCRYPTED_DIR, filename);

    // Encrypt the file
    const { iv, encryptedData } = encryptFile(req.file.buffer);

    // Save encrypted file
    fs.writeFileSync(filepath, encryptedData);

    // Save file details to database
    const file = new File({
      filename: filename,
      originalname: req.file.originalname,
      size: req.file.size,
      uploadedBy: req.user.id,
      contentType: req.file.mimetype,
      path: filepath,
      iv: iv, // Store the IV
      watermarked: false
    });

    await file.save();
    console.log('File saved:', {
      filename,
      iv,
      path: filepath
    });

    res.json({ 
      message: 'File uploaded successfully',
      file: {
        filename: file.filename,
        originalname: file.originalname,
        size: file.size
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

app.get('/api/files', authenticateToken, async (req, res) => {
  try {
    const files = await File.find({ uploadedBy: req.user.id })
      .populate('uploadedBy', 'name email')
      .sort({ uploadDate: -1 });
    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ message: 'Error fetching files' });
  }
});

app.get('/api/files/shared', authenticateToken, async (req, res) => {
  try {
    let files;
    if (req.user.role === 'student') {
      // Students can see files uploaded by teachers
      const teachers = await User.find({ role: 'teacher' });
      const teacherIds = teachers.map(teacher => teacher._id);
      files = await File.find({ uploadedBy: { $in: teacherIds } })
        .populate('uploadedBy', 'name email')
        .sort({ uploadDate: -1 });
    } else {
      // Teachers can see all files
      files = await File.find()
        .populate('uploadedBy', 'name email')
        .sort({ uploadDate: -1 });
    }
    res.json(files);
  } catch (error) {
    console.error('Error fetching shared files:', error);
    res.status(500).json({ message: 'Error fetching files' });
  }
});

app.get('/api/download/:filename', authenticateToken, async (req, res) => {
  try {
    console.log('Download request for file:', req.params.filename);
    
    const file = await File.findOne({ filename: req.params.filename });
    
    if (!file) {
      console.log('File not found in database');
      return res.status(404).json({ message: 'File not found in database' });
    }

    console.log('File found:', {
      filename: file.filename,
      path: file.path,
      iv: file.iv ? 'present' : 'missing',
      contentType: file.contentType
    });

    if (!fs.existsSync(file.path)) {
      console.error('File not found on disk:', file.path);
      return res.status(404).json({ message: 'File not found on disk' });
    }

    try {
      // Read the encrypted file
      const encryptedData = fs.readFileSync(file.path);
      console.log('Read encrypted data, size:', encryptedData.length);

      if (!file.iv) {
        throw new Error('IV not found for file');
      }

      // Decrypt the file
      const decryptedData = decryptFile(encryptedData, file.iv);
      console.log('Decryption successful, size:', decryptedData.length);

      // Set response headers
      res.setHeader('Content-Type', file.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${file.originalname}"`);
      
      // Send the decrypted file
      res.send(decryptedData);

      // Log successful download
      await File.findByIdAndUpdate(file._id, {
        $push: {
          accessLog: {
            userId: req.user.id,
            action: 'DOWNLOAD',
            timestamp: new Date(),
            ipAddress: req.ip
          }
        }
      });

    } catch (decryptError) {
      console.error('Decryption error:', decryptError);
      throw new Error(`Decryption failed: ${decryptError.message}`);
    }

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      message: 'Error downloading file',
      error: error.message
    });
  }
});

app.delete('/api/files/:fileId', authenticateToken, async (req, res) => {
  try {
    const file = await File.findOne({ 
      _id: req.params.fileId,
      uploadedBy: req.user.id 
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete the physical files
    fs.unlinkSync(file.path);
    fs.unlinkSync(file.originalPath);

    // Delete from database
    await File.deleteOne({ _id: req.params.fileId });

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

// Vault Routes
app.post('/api/vault/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Use a stronger encryption for vault items
    const strongKey = crypto.pbkdf2Sync(
      ENCRYPTION_KEY.toString('hex'),
      req.user.id,
      100000,
      32,
      'sha512'
    );

    const { iv, encryptedData } = encryptFile(req.file.buffer, strongKey);
    const encryptedFilename = `vault-${Date.now()}-${req.file.originalname}`;
    const encryptedPath = path.join(ENCRYPTED_DIR, encryptedFilename);
    fs.writeFileSync(encryptedPath, encryptedData);

    const vaultItem = new VaultItem({
      filename: encryptedFilename,
      originalname: req.file.originalname,
      size: req.file.size,
      owner: req.user.id,
      contentType: req.file.mimetype,
      path: encryptedPath,
      iv: iv,
      category: req.body.category || 'other',
      description: req.body.description,
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      lastAccessed: new Date()
    });

    await vaultItem.save();

    await logSecurityEvent(
      'File Upload',
      req.user,
      'success',
      `File "${req.file.originalname}" encrypted and stored in vault`,
      req.ip
    );

    res.json(vaultItem);
  } catch (error) {
    await logSecurityEvent(
      'File Upload',
      req.user,
      'error',
      `Failed to upload file: ${error.message}`,
      req.ip
    );

    console.error('Vault upload error:', error);
    res.status(500).json({ error: 'Failed to store in vault' });
  }
});

app.get('/api/vault/files', authenticateToken, async (req, res) => {
  try {
    const vaultItems = await VaultItem.find({ owner: req.user.id })
      .sort({ uploadDate: -1 });
    res.json(vaultItems);
  } catch (error) {
    console.error('Error fetching vault items:', error);
    res.status(500).json({ message: 'Error accessing vault' });
  }
});

app.get('/api/vault/download/:filename', authenticateToken, async (req, res) => {
  try {
    const vaultItem = await VaultItem.findOne({
      filename: req.params.filename,
      owner: req.user.id
    });

    if (!vaultItem) {
      return res.status(404).json({ error: 'File not found in vault' });
    }

    const strongKey = crypto.pbkdf2Sync(
      ENCRYPTION_KEY.toString('hex'),
      req.user.id,
      100000,
      32,
      'sha512'
    );

    const encryptedData = fs.readFileSync(vaultItem.path);
    const decryptedData = decryptFile(encryptedData, vaultItem.iv, strongKey);

    vaultItem.lastAccessed = new Date();
    await vaultItem.save();

    await new SecurityLog({
      event: 'File Download',
      user: req.user.name,
      status: 'success',
      details: `File "${vaultItem.originalname}" decrypted and downloaded`,
      ipAddress: req.ip
    }).save();

    res.setHeader('Content-Type', vaultItem.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${vaultItem.originalname}"`);
    res.send(decryptedData);
  } catch (error) {
    await new SecurityLog({
      event: 'File Download',
      user: req.user.name,
      status: 'error',
      details: `Failed to download file: ${error.message}`,
      ipAddress: req.ip
    }).save();

    console.error('Vault download error:', error);
    res.status(500).json({ error: 'Error accessing vault file' });
  }
});

app.delete('/api/vault/:itemId', authenticateToken, async (req, res) => {
  try {
    const vaultItem = await VaultItem.findOne({
      _id: req.params.itemId,
      owner: req.user.id
    });

    if (!vaultItem) {
      return res.status(404).json({ message: 'Item not found in vault' });
    }

    fs.unlinkSync(vaultItem.path);
    await VaultItem.deleteOne({ _id: req.params.itemId });

    await new SecurityLog({
      event: 'File Delete',
      user: req.user.name,
      status: 'success',
      details: `File "${vaultItem.originalname}" deleted from vault`,
      ipAddress: req.ip
    }).save();

    res.json({ message: 'Vault item deleted successfully' });
  } catch (error) {
    await new SecurityLog({
      event: 'File Delete',
      user: req.user.name,
      status: 'error',
      details: `Failed to delete file: ${error.message}`,
      ipAddress: req.ip
    }).save();

    console.error('Vault delete error:', error);
    res.status(500).json({ message: 'Error deleting vault item' });
  }
});

// Security Logs Routes
app.get('/api/security/logs', authenticateToken, async (req, res) => {
  try {
    // Only allow teachers to view all logs, students see their own logs
    const query = req.user.role === 'teacher' ? {} : { user: req.user.name };
    
    const logs = await SecurityLog.find(query)
      .sort({ timestamp: -1 })
      .limit(100);

    // If no logs exist yet, return empty array instead of error
    res.json(logs || []);
  } catch (error) {
    console.error('Error fetching security logs:', error);
    res.status(500).json({ message: 'Error fetching logs' });
  }
});

// Add these helper functions to log security events
const logSecurityEvent = async (event, user, status, details, ip) => {
  try {
    const log = new SecurityLog({
      event,
      user: user?.name || 'Anonymous',
      status,
      details,
      ipAddress: ip
    });
    await log.save();
  } catch (error) {
    console.error('Error logging security event:', error);
  }
};

// Update the debug route - remove authentication temporarily
app.get('/api/debug/files', async (req, res) => {
  try {
    const files = await File.find().select('filename originalname path iv');
    
    const fileChecks = files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
      exists: fs.existsSync(file.path),
      iv: file.iv ? 'present' : 'missing',
      ivLength: file.iv ? file.iv.length : 0
    }));

    res.json({
      uploadDir: UPLOAD_DIR,
      encryptedDir: ENCRYPTED_DIR,
      dirExists: {
        uploadDir: fs.existsSync(UPLOAD_DIR),
        encryptedDir: fs.existsSync(ENCRYPTED_DIR)
      },
      totalFiles: files.length,
      fileChecks
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ 
      message: 'Error checking files', 
      error: error.message,
      stack: error.stack 
    });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

const startServer = async () => {
  try {
    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 