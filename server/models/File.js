const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  uploadDate: { type: Date, default: Date.now },
  size: Number,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  contentType: String,
  path: String,
  originalPath: String,
  iv: String,
  // New security fields
  hash: String,
  watermarked: Boolean,
  accessLog: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    action: String,
    timestamp: Date,
    ipAddress: String
  }],
  permissions: {
    allowDownload: { type: Boolean, default: true },
    allowPrint: { type: Boolean, default: true },
    expiryDate: Date,
    restrictedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  integrityChecks: [{
    timestamp: Date,
    status: String,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
});

module.exports = mongoose.model('File', FileSchema); 