const Joi = require("joi");

const registerSchema = {
    body: Joi.object({
      fullName: Joi.string().trim().min(3).max(100).required(),
      email: Joi.string().email().optional(),
      phone: Joi.string().pattern(/^\+?\d{10,15}$/).optional(),
      password: Joi.string().min(8).max(128).required(),
      enterpriseName: Joi.string().trim().min(3).max(100).optional(),
      address: Joi.object({
        street: Joi.string().trim().required(),
        city: Joi.string().trim().required(),
        state: Joi.string().trim().required(),
        country: Joi.string().trim().required(),
        postalCode: Joi.string().trim().required(),
      }).required(),
    }).or("email", "phone"), // Either email or phone must be provided
  };

const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().optional(),
    phone: Joi.string().pattern(/^\+?\d{10,15}$/).optional(),
    password: Joi.string().required(),
  }).or("email", "phone"), // Either email or phone must be provided
};

const refreshTokenSchema = {
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

const resetPasswordSchema = {
  body: Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(8).max(128).required(),
  }),
};

const verifyEmailSchema = {
  body: Joi.object({
    token: Joi.string().required(),
  }),
};

const changePasswordSchema = {
  body: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).max(128).required(),
  }),
};

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changePasswordSchema,
};
