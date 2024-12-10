class ResponseFormatter {
    static success(data = null, message = 'Success') {
      return {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
      };
    }
  
    static error(message = 'Error occurred', errors = null, statusCode = 400) {
      return {
        success: false,
        message,
        errors,
        statusCode,
        timestamp: new Date().toISOString()
      };
    }
  
    static pagination(data, page, limit, total) {
      return {
        success: true,
        data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        },
        timestamp: new Date().toISOString()
      };
    }
  }
  
  module.exports = ResponseFormatter;