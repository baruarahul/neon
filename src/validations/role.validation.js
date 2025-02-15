const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createRole = {
  body: Joi.object({
    name: Joi.string().trim().min(3).max(100).required(),
    level: Joi.string().valid("channel_partner", "reseller", "enterprise", "user", "device", "admin").required(),
    parentRoleId: Joi.string().custom(objectId).optional().allow(null),
    permissions: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          allowed: Joi.boolean().default(true),
        })
      )
      .optional(),
  }),
};

const updateRole = {
  body: Joi.object({
    name: Joi.string().trim().min(3).max(100).optional(),
    permissions: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          allowed: Joi.boolean().default(true),
        })
      )
      .optional(),
  }),
};

const getRoleById = {
  params: Joi.object({
    roleId: Joi.string().custom(objectId).required(),
  }),
};

const deleteRole = {
  params: Joi.object({
    roleId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createRole,
  updateRole,
  getRoleById,
  deleteRole,
};
