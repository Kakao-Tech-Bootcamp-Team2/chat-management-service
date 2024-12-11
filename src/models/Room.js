const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['owner', 'member'],
    default: 'member'
  }
});

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    select: false  // 조회 시 비밀번호 필드 제외
  },
  participants: [participantSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);