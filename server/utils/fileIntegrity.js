const crypto = require('crypto');
const fs = require('fs');

class FileIntegrityManager {
  static generateFileHash(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  static verifyFileIntegrity(buffer, storedHash) {
    const currentHash = this.generateFileHash(buffer);
    return currentHash === storedHash;
  }

  static async generateFileMetadata(buffer) {
    const hash = this.generateFileHash(buffer);
    const size = buffer.length;
    const timestamp = Date.now();

    return {
      hash,
      size,
      timestamp,
      lastVerified: timestamp
    };
  }
}

module.exports = FileIntegrityManager; 