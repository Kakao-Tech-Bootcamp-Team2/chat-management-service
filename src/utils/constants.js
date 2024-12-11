module.exports = {
    // 알림 타입
    NOTIFICATION_TYPES: {
      MENTION: 'mention',
      INVITE: 'invite',
      SYSTEM: 'system'
    },
  
    // 사용자 역할
    USER_ROLES: {
      OWNER: 'owner',
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
      AI_CONTEXT: 'ai:context:',
      ROOM_SETTINGS: 'room:settings:',
      USER_SESSION: 'user:session:'
    },
  
    // 캐시 만료 시간 (초)
    CACHE_TTL: {
      AI_CONTEXT: 3600,     // 1시간
      ROOM_SETTINGS: 1800,  // 30분
      USER_SESSION: 86400   // 24시간
    }
  };