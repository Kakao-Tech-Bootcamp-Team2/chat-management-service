const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['mention', 'invite', 'system']
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  roomId: {
    type: String,
    required: false
  },
  messageId: {
    type: String,
    required: false
  },
  isRead: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// 인덱스 설정
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });  // TTL 인덱스

module.exports = mongoose.model('Notification', notificationSchema);