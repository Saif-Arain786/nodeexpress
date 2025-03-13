const Joi = require('joi');
const uservalidate = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email',
        'string.empty': 'Email is....... required',
        "string.base": 'Email must be a string',
        'any.required': 'Email is required'
    })
})
module.exports = uservalidate;