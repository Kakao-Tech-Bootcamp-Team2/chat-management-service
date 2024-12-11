const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String,
    trim: true
  },
  isPrivate: { 
    type: Boolean, 
    default: false 
  },
  password: { 
    type: String,
    select: false  // 기본적으로 조회 시 비밀번호 필드 제외
  },
  participants: [{
    userId: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      enum: ['owner', 'admin', 'member'],
      default: 'member'
    },
    joinedAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  aiSettings: {
    enabled: Boolean,
    aiType: String,
    systemPrompt: String,
    temperature: Number
  },
  inviteCodes: [{
    code: String,
    expiresAt: Date,
    createdBy: String
  }]
}, {
  timestamps: true
});

// 인덱스 설정
roomSchema.index({ name: 1 });
roomSchema.index({ 'participants.userId': 1 });
roomSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Room', roomSchema);