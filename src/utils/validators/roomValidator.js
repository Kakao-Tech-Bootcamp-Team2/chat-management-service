const { USER_ROLES } = require('../constants');

class RoomValidator {
  static validateRoomData(data) {
    const errors = [];

    // 방 이름 검증
    if (!data.name || typeof data.name !== 'string') {
      errors.push('Room name is required and must be a string');
    } else if (data.name.length < 2 || data.name.length > 50) {
      errors.push('Room name must be between 2 and 50 characters');
    }

    // 설명 검증 (선택사항)
    if (data.description && typeof data.description !== 'string') {
      errors.push('Room description must be a string');
    } else if (data.description && data.description.length > 500) {
      errors.push('Room description must not exceed 500 characters');
    }

    // 비공개방 설정 검증
    if (data.isPrivate && typeof data.isPrivate !== 'boolean') {
      errors.push('isPrivate must be a boolean value');
    }

    // 비밀번호 검증 (비공개방인 경우)
    if (data.isPrivate && (!data.password || typeof data.password !== 'string')) {
      errors.push('Password is required for private rooms');
    }

    return errors;
  }

  static validateParticipant(userId, role) {
    const errors = [];

    if (!userId || typeof userId !== 'string') {
      errors.push('Valid user ID is required');
    }

    if (role && !Object.values(USER_ROLES).includes(role)) {
      errors.push(`Role must be one of: ${Object.values(USER_ROLES).join(', ')}`);
    }

    return errors;
  }
}

module.exports = RoomValidator;