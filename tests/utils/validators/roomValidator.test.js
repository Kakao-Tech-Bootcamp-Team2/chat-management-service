const RoomValidator = require('../../../src/utils/validators/roomValidator');
const { USER_ROLES } = require('../../../src/utils/constants');

describe('RoomValidator', () => {
  describe('validateRoomData', () => {
    it('should validate valid room data', () => {
      const validData = {
        name: 'Test Room',
        description: 'Test Description',
        isPrivate: false
      };

      const errors = RoomValidator.validateRoomData(validData);
      expect(errors).toHaveLength(0);
    });

    it('should validate private room with password', () => {
      const validData = {
        name: 'Private Room',
        description: 'Private Room Description',
        isPrivate: true,
        password: 'secretPassword'
      };

      const errors = RoomValidator.validateRoomData(validData);
      expect(errors).toHaveLength(0);
    });

    it('should return errors for missing name', () => {
      const invalidData = {
        description: 'Test Description'
      };

      const errors = RoomValidator.validateRoomData(invalidData);
      expect(errors).toContain('Room name is required and must be a string');
    });

    it('should return errors for invalid name length', () => {
      const invalidData = {
        name: 'A',
        description: 'Test Description'
      };

      const errors = RoomValidator.validateRoomData(invalidData);
      expect(errors).toContain('Room name must be between 2 and 50 characters');
    });

    it('should return errors for missing password in private room', () => {
      const invalidData = {
        name: 'Private Room',
        isPrivate: true
      };

      const errors = RoomValidator.validateRoomData(invalidData);
      expect(errors).toContain('Password is required for private rooms');
    });
  });

  describe('validateParticipant', () => {
    it('should validate valid participant data', () => {
      const userId = 'user123';
      const role = USER_ROLES.MEMBER;

      const errors = RoomValidator.validateParticipant(userId, role);
      expect(errors).toHaveLength(0);
    });

    it('should return errors for missing userId', () => {
      const role = USER_ROLES.MEMBER;

      const errors = RoomValidator.validateParticipant(null, role);
      expect(errors).toContain('Valid user ID is required');
    });

    it('should return errors for invalid role', () => {
      const userId = 'user123';
      const invalidRole = 'invalid_role';

      const errors = RoomValidator.validateParticipant(userId, invalidRole);
      expect(errors).toContain(`Role must be one of: ${Object.values(USER_ROLES).join(', ')}`);
    });
  });
}); 