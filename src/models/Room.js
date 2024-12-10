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
      enum: ['admin', 'member'], 
      default: 'member' 
    },
    joinedAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  aiParticipants: [{
    type: { 
      type: String, 
      enum: ['wayneAI', 'consultingAI'],
      required: true
    },
    settings: {
      type: Map,
      of: String,
      default: new Map()
    }
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// 인덱스 설정
roomSchema.index({ name: 1 });
roomSchema.index({ 'participants.userId': 1 });
roomSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Room', roomSchema);