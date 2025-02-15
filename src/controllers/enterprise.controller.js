const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { validate } = require("../middleware/validate.middleware");
const enterpriseService = require("../services/enterprise.service");
const { createEnterprise, updateEnterprise, getEnterpriseById, deleteEnterprise } = require("../validations/enterprise.validation");

/**
 * Create a new enterprise
 */
const create = catchAsync(async (req, res) => {
  validate(createEnterprise, req); // Apply validation
  const enterprise = await enterpriseService.createEnterprise(req.body);
  res.status(httpStatus.CREATED).json({ success: true, data: enterprise });
});

/**
 * Get all enterprises with pagination
 */
const getAll = catchAsync(async (req, res) => {
  const enterprises = await enterpriseService.getAllEnterprises(req.query);
  res.json({ success: true, data: enterprises });
});

/**
 * Get a enterprise by ID
 */
const getById = catchAsync(async (req, res) => {
  validate(getEnterpriseById, req); // Apply validation
  const enterprise = await enterpriseService.getEnterpriseById(req.params.enterpriseId);
  if (!enterprise) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: "Enterprise not found" });
  }
  res.json({ success: true, data: enterprise });
});

/**
 * Update a enterprise
 */
const update = catchAsync(async (req, res) => {
  validate(updateEnterprise, req); // Apply validation
  const updatedEnterprise = await enterpriseService.updateEnterprise(req.params.enterpriseId, req.body);
  if (!updatedEnterprise) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: "Enterprise not found" });
  }
  res.json({ success: true, data: updatedEnterprise });
});

/**
 * Soft delete a enterprise
 */
const remove = catchAsync(async (req, res) => {
  validate(deleteEnterprise, req); // Apply validation
  await enterpriseService.deleteEnterprise(req.params.enterpriseId);
  res.json({ success: true, message: "Enterprise deleted successfully" });
});

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
