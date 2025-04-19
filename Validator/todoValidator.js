const Joi = require('joi'); 
const todoValidate = Joi.object({
    title: Joi.string().required().messages({
        'string.empty': 'Title is required',
        'string.base': 'Title must be a string',
        'any.required': 'Title is required'
    }),
    status: Joi.string().valid('completed', 'pending', 'in-progress', 'deleted').default('pending'),

  
});
module.exports=todoValidate