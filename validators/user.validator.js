import Joi from 'joi';

export const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().required().min(2),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    mobile: Joi.string().length(10),
    gender: Joi.string().valid('male', 'female', 'other')
  });
  return schema.validate(user);
};
export const validateLogin = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  });
  return schema.validate(body);
};
