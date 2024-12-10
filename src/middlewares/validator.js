const validateRequest = (schema) => {
    return (req, res, next) => {
      try {
        if (schema.params) {
          validateFields(req.params, schema.params, 'params');
        }
        if (schema.query) {
          validateFields(req.query, schema.query, 'query');
        }
        if (schema.body) {
          validateFields(req.body, schema.body, 'body');
        }
        next();
      } catch (error) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      }
    };
  };
  
  const validateFields = (data, schema, location) => {
    const errors = [];
  
    Object.keys(schema).forEach(field => {
      const rules = schema[field];
      const value = data[field];
  
      // Required 체크
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required in ${location}`);
      }
  
      if (value !== undefined && value !== null) {
        // Type 체크
        if (rules.type && typeof value !== rules.type) {
          errors.push(`${field} must be type of ${rules.type} in ${location}`);
        }
  
        // Enum 체크
        if (rules.enum && !rules.enum.includes(value)) {
          errors.push(`${field} must be one of [${rules.enum.join(', ')}] in ${location}`);
        }
  
        // Min/Max 체크 (문자열 길이 또는 숫자 범위)
        if (rules.min !== undefined) {
          if ((typeof value === 'string' && value.length < rules.min) ||
              (typeof value === 'number' && value < rules.min)) {
            errors.push(`${field} must be greater than or equal to ${rules.min} in ${location}`);
          }
        }
  
        if (rules.max !== undefined) {
          if ((typeof value === 'string' && value.length > rules.max) ||
              (typeof value === 'number' && value > rules.max)) {
            errors.push(`${field} must be less than or equal to ${rules.max} in ${location}`);
          }
        }
      }
    });
  
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  };
  
  module.exports = { validateRequest };