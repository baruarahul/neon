const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { validate } = require("../middleware/validate.middleware");
const workspaceService = require("../services/workspaces.service");
const { createWorkspace, updateWorkspace, getWorkspaceById, deleteWorkspace } = require("../validations/workspace.validation");

/**
 * Create a new workspace
 */
const create = catchAsync(async (req, res) => {
  validate(createWorkspace, req); // Apply validation
  const workspace = await workspaceService.createWorkspace(req.body);
  res.status(httpStatus.CREATED).json({ success: true, data: workspace });
});

/**
 * Get all workspaces with pagination
 */
const getAll = catchAsync(async (req, res) => {
  const workspaces = await workspaceService.getAllWorkspaces(req.query);
  res.json({ success: true, data: workspaces });
});

/**
 * Get a workspace by ID
 */
const getById = catchAsync(async (req, res) => {
  validate(getWorkspaceById, req); // Apply validation
  const workspace = await workspaceService.getWorkspaceById(req.params.workspaceId);
  if (!workspace) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: "Workspace not found" });
  }
  res.json({ success: true, data: workspace });
});

/**
 * Update a workspace
 */
const update = catchAsync(async (req, res) => {
  validate(updateWorkspace, req); // Apply validation
  const updatedWorkspace = await workspaceService.updateWorkspace(req.params.workspaceId, req.body);
  if (!updatedWorkspace) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: "Workspace not found" });
  }
  res.json({ success: true, data: updatedWorkspace });
});

/**
 * Soft delete a workspace
 */
const remove = catchAsync(async (req, res) => {
  validate(deleteWorkspace, req); // Apply validation
  await workspaceService.deleteWorkspace(req.params.workspaceId);
  res.json({ success: true, message: "Workspace deleted successfully" });
});

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
