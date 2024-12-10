const winston = require('winston');
const { format } = winston;

// 로그 레벨 정의
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 개발/운영 환경에 따른 로그 레벨 설정
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// 로그 색상 설정
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

// 로그 포맷 설정
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  format.colorize({ all: true }),
  format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// createLogger 함수 추가
const createLogger = (label) => {
  return winston.createLogger({
    level: level(),
    levels,
    format: format.combine(
      format.label({ label }),
      logFormat
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: `logs/${label}/error.log`,
        level: 'error',
      }),
      new winston.transports.File({
        filename: `logs/${label}/combined.log`,
      }),
    ],
  });
};

module.exports = { createLogger };