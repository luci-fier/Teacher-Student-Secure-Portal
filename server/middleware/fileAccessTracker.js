const File = require('../models/File');
const AuditTrail = require('../utils/auditTrail');

async function trackFileAccess(req, res, next) {
  const originalSend = res.send;
  
  res.send = async function(data) {
    try {
      const fileId = req.params.fileId;
      const file = await File.findById(fileId);
      
      if (file) {
        // Log access
        file.accessLog.push({
          userId: req.user.id,
          action: req.method,
          timestamp: new Date(),
          ipAddress: req.ip
        });
        await file.save();

        // Create audit trail
        await AuditTrail.log({
          user: req.user.id,
          action: 'FILE_ACCESS',
          resource: 'File',
          resourceId: fileId,
          details: {
            method: req.method,
            filename: file.originalname
          },
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']
        });
      }
    } catch (error) {
      console.error('Error tracking file access:', error);
    }

    originalSend.call(this, data);
  };

  next();
}

module.exports = trackFileAccess; 