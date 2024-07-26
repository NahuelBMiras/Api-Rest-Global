import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().max(80),
  username: Joi.string().max(80),
  password: Joi.string().min(8).max(72).required(),
});
