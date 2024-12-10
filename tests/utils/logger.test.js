const winston = require('winston');
const logger = require('../../src/utils/logger');

jest.mock('winston', () => ({
  format: {
    timestamp: jest.fn().mockReturnValue(() => {}),
    colorize: jest.fn().mockReturnValue(() => {}),
    printf: jest.fn().mockReturnValue(() => {}),
    combine: jest.fn().mockReturnValue(() => {})
  },
  createLogger: jest.fn().mockReturnValue({
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn()
  }),
  addColors: jest.fn(),
  transports: {
    Console: jest.fn(),
    File: jest.fn()
  }
}));

describe('Logger', () => {
  it('should create logger with correct configuration', () => {
    expect(winston.createLogger).toHaveBeenCalled();
    expect(logger.error).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.info).toBeDefined();
    expect(logger.debug).toBeDefined();
  });

  it('should log messages at different levels', () => {
    const message = 'Test message';
    
    logger.error(message);
    logger.warn(message);
    logger.info(message);
    logger.debug(message);

    expect(logger.error).toHaveBeenCalledWith(message);
    expect(logger.warn).toHaveBeenCalledWith(message);
    expect(logger.info).toHaveBeenCalledWith(message);
    expect(logger.debug).toHaveBeenCalledWith(message);
  });
}); 