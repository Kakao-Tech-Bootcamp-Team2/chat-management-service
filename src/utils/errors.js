class AppError extends Error {
  constructor(message, status = 500, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
    this.timestamp = new Date().toISOString();
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message) {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404, 'NOT_FOUND_ERROR');
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthorizationError,
  NotFoundError
}; 