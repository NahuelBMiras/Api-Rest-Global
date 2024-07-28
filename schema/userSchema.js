import Joi from 'joi';

export const userSchema = Joi.object({
  name: Joi.string().max(40).required(),
  lastname: Joi.string().max(40).required(),
  email: Joi.string().email().max(80).required(),
  username: Joi.string().max(80).required(),
  password: Joi.string().min(8).max(72).required(),
});

export const editUserSchema = Joi.object({
  name: Joi.string().max(40),
  lastname: Joi.string().max(40),
  email: Joi.string().email().max(80),
  username: Joi.string().max(80),
  changePassword: Joi.string().min(8).max(72),
});
