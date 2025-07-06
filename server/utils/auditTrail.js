const mongoose = require('mongoose');

const AuditSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  action: String,
  resource: String,
  resourceId: mongoose.Schema.Types.ObjectId,
  details: Object,
  ipAddress: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now }
});

const Audit = mongoose.model('Audit', AuditSchema);

class AuditTrail {
  static async log(data) {
    try {
      const audit = new Audit(data);
      await audit.save();
    } catch (error) {
      console.error('Audit logging failed:', error);
    }
  }

  static async getResourceHistory(resourceId) {
    return await Audit.find({ resourceId })
      .populate('user', 'name email role')
      .sort('-timestamp');
  }

  static async getUserActivity(userId) {
    return await Audit.find({ user: userId })
      .sort('-timestamp');
  }
}

module.exports = AuditTrail; 