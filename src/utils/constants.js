module.exports = {
    // 알림 타입
    NOTIFICATION_TYPES: {
      MENTION: 'mention',
      ROOM_INVITE: 'roomInvite',
      NEW_MESSAGE: 'newMessage',
      SYSTEM: 'system'
    },
  
    // 사용자 역할
    USER_ROLES: {
      ADMIN: 'admin',
      MEMBER: 'member'
    },
  
    // AI 타입
    AI_TYPES: {
      WAYNE: 'wayneAI',
      CONSULTING: 'consultingAI'
    },
  
    // 페이지네이션 기본값
    PAGINATION: {
      DEFAULT_PAGE: 1,
      DEFAULT_LIMIT: 20,
      MAX_LIMIT: 100
    },
  
    // 캐시 키 접두사
    CACHE_KEYS: {
      ROOM: 'room:',
      USER: 'user:',
      NOTIFICATION: 'notification:'
    },
  
    // 캐시 만료 시간 (초)
    CACHE_TTL: {
      ROOM: 3600,        // 1시간
      USER: 1800,        // 30분
      NOTIFICATION: 300  // 5분
    }
  };