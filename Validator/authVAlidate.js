const Joi = require('joi');

const userValidate = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email',
        'string.empty': 'Email is required',
        'string.base': 'Email must be a string',
        'any.required': 'Email is required'
    }),
    password: Joi.string()
        .min(8) // Ensure at least 8 characters
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
        .messages({
            'string.base': 'Password must be a string',
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            'any.required': 'Password is required'
        })
});

module.exports = userValidate;
