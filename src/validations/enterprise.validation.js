const Joi = require("joi");
const { objectId } = require("./custom.validation"); // Custom ObjectId validation

// Validation schema for creating a new enterprise
const createEnterprise = {
  body: Joi.object({
    enterpriseId: Joi.number().integer().positive().optional(), // Will be auto-generated
    name: Joi.string().trim().min(3).max(100).required(),
    ownerId: Joi.string().custom(objectId).required(),
    industry: Joi.string().trim().optional().allow(null),
    website: Joi.string().uri().optional().allow(null),
    contactEmail: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?\d{10,15}$/).required(),
    address: Joi.object({
      street: Joi.string().trim().optional(),
      city: Joi.string().trim().optional(),
      state: Joi.string().trim().optional(),
      country: Joi.string().trim().optional(),
      postalCode: Joi.string().trim().optional(),
    }).optional(),
    settings: Joi.object({
      allowCrossTeamVisibility: Joi.boolean().optional(),
      maxUsers: Joi.number().integer().min(1).max(100000).optional(),
    }).optional(),
    subscriptionPlan: Joi.string().valid("basic", "premium", "enterprise").optional(),
  }),
};

// Validation schema for updating a enterprise
const updateEnterprise = {
  body: Joi.object({
    name: Joi.string().trim().min(3).max(100).optional(),
    industry: Joi.string().trim().optional().allow(null),
    website: Joi.string().uri().optional().allow(null),
    contactEmail: Joi.string().email().optional(),
    phone: Joi.string().pattern(/^\+?\d{10,15}$/).optional(),
    address: Joi.object({
      street: Joi.string().trim().optional(),
      city: Joi.string().trim().optional(),
      state: Joi.string().trim().optional(),
      country: Joi.string().trim().optional(),
      postalCode: Joi.string().trim().optional(),
    }).optional(),
    settings: Joi.object({
      allowCrossTeamVisibility: Joi.boolean().optional(),
      maxUsers: Joi.number().integer().min(1).max(100000).optional(),
    }).optional(),
    subscriptionPlan: Joi.string().valid("basic", "premium", "enterprise").optional(),
  }),
};

// Validation schema for retrieving a enterprise by ID
const getEnterpriseById = {
  params: Joi.object({
    enterpriseId: Joi.string().custom(objectId).required(),
  }),
};

// Validation schema for deleting a enterprise
const deleteEnterprise = {
  params: Joi.object({
    enterpriseId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createEnterprise,
  updateEnterprise,
  getEnterpriseById,
  deleteEnterprise,
};
