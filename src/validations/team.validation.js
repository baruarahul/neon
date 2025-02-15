const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createTeam = {
  body: Joi.object({
    name: Joi.string().trim().min(3).max(100).required(),
    enterpriseId: Joi.string().custom(objectId).required(),
    workspaceId: Joi.string().custom(objectId).optional(),
    members: Joi.array().items(Joi.string().custom(objectId)).optional(),
    permissions: Joi.array().items(Joi.string()).optional(),
    createdBy: Joi.string().custom(objectId).required(),
  }),
};

const updateTeam = {
  body: Joi.object({
    name: Joi.string().trim().min(3).max(100).optional(),
    members: Joi.array().items(Joi.string().custom(objectId)).optional(),
    permissions: Joi.array().items(Joi.string()).optional(),
  }),
};

const getTeamById = {
  params: Joi.object({
    teamId: Joi.string().custom(objectId).required(),
  }),
};

const deleteTeam = {
  params: Joi.object({
    teamId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createTeam,
  updateTeam,
  getTeamById,
  deleteTeam,
};
