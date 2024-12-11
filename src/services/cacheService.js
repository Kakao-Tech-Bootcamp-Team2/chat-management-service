const Redis = require('ioredis');
const config = require('../config');
const { createLogger } = require('../utils/logger');
const logger = createLogger('CacheService');

class CacheService {
  constructor() {
    this.client = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      db: config.redis.db,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3
    });

    this.client.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    this.client.on('connect', () => {
      logger.info('Redis Client Connected');
    });

    // 기본 TTL 설정
    this.defaultTTL = {
      aiContext: 3600,    // AI 컨텍스트 1시간
      roomSettings: 1800, // 채팅방 설정 30분
      userSession: 86400  // 사용자 세션 24시간
    };
  }

  // 키 생성 헬퍼 메서드
  getKey(type, id) {
    const keyMap = {
      aiContext: `ai:context:${id}`,
      roomSettings: `room:settings:${id}`,
      userSession: `user:session:${id}`
    };
    return keyMap[type] || id;
  }

  // 데이터 조회
  async get(type, id) {
    try {
      const key = this.getKey(type, id);
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache get error:', { type, id, error });
      return null;
    }
  }

  // 데이터 저장
  async set(type, id, value, ttl) {
    try {
      const key = this.getKey(type, id);
      await this.client.set(
        key,
        JSON.stringify(value),
        'EX',
        ttl || this.defaultTTL[type] || 3600
      );
      return true;
    } catch (error) {
      logger.error('Cache set error:', { type, id, error });
      return false;
    }
  }

  // 데이터 삭제
  async delete(type, id) {
    try {
      const key = this.getKey(type, id);
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error('Cache delete error:', { type, id, error });
      return false;
    }
  }

  // 특정 패턴의 모든 키 삭제
  async deletePattern(pattern) {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
      return true;
    } catch (error) {
      logger.error('Cache delete pattern error:', { pattern, error });
      return false;
    }
  }

  // 특정 타입의 모든 데이터 삭제
  async clearType(type) {
    return this.deletePattern(`${type}:*`);
  }
}

module.exports = new CacheService(); 