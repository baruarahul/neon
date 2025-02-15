const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createWorkspace = {
  body: Joi.object({
    name: Joi.string().trim().min(3).max(100).required(),
    enterpriseId: Joi.string().custom(objectId).required(),
    ownerId: Joi.string().custom(objectId).required(),
    parentWorkspaceId: Joi.string().custom(objectId).optional().allow(null),
    allowedUserRoles: Joi.array().items(Joi.string()).optional(),
    billingInfo: Joi.object({
      cardLast4: Joi.string().length(4).optional(),
      billingAddress: Joi.string().trim().optional(),
    }).optional(),
    settings: Joi.object({
      crossWorkspaceVisibility: Joi.boolean().optional(),
      autoRoleAssignment: Joi.boolean().optional(),
    }).optional(),
  }),
};

const updateWorkspace = {
  body: Joi.object({
    name: Joi.string().trim().min(3).max(100).optional(),
    allowedUserRoles: Joi.array().items(Joi.string()).optional(),
    billingInfo: Joi.object({
      cardLast4: Joi.string().length(4).optional(),
      billingAddress: Joi.string().trim().optional(),
    }).optional(),
    settings: Joi.object({
      crossWorkspaceVisibility: Joi.boolean().optional(),
      autoRoleAssignment: Joi.boolean().optional(),
    }).optional(),
  }),
};

const getWorkspaceById = {
  params: Joi.object({
    workspaceId: Joi.string().custom(objectId).required(),
  }),
};

const deleteWorkspace = {
  params: Joi.object({
    workspaceId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createWorkspace,
  updateWorkspace,
  getWorkspaceById,
  deleteWorkspace,
};
