const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createUser = {
  body: Joi.object({
    fullName: Joi.string().trim().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required(),
    phone: Joi.string().pattern(/^\+?\d{10,15}$/).required(),
    enterpriseId: Joi.string().custom(objectId).required(),
    workspaceId: Joi.string().custom(objectId).optional(),
    teamId: Joi.string().custom(objectId).optional(),
    parentUserId: Joi.string().custom(objectId).optional(),
    roleName: Joi.string()
      .valid("Super Admin", "Enterprise Admin", "Workspace Manager", "Team Member", "Device")
      .optional(),
  }),
};

const updateUser = {
  body: Joi.object({
    fullName: Joi.string().trim().min(3).max(100).optional(),
    password: Joi.string().min(8).max(128).optional(),
    phone: Joi.string().pattern(/^\+?\d{10,15}$/).optional(),
    avatar: Joi.string().uri().optional(),
    status: Joi.string().valid("active", "suspended", "deleted").optional(),
  }),
};

const getUserById = {
  params: Joi.object({
    userId: Joi.string().custom(objectId).required(),
  }),
};

const deleteUser = {
  params: Joi.object({
    userId: Joi.string().custom(objectId).required(),
  }),
};

const updateUserRole = {
  params: Joi.object({
    userId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object({
    roleId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createUser,
  updateUser,
  getUserById,
  deleteUser,
  updateUserRole,
};
