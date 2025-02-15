const httpStatus = require("http-status");
const Workspace = require("../models/workspaces.model");

/**
 * Create a workspace
 * @param {Object} workspaceData
 * @returns {Promise<Workspace>}
 */
const createWorkspace = async (workspaceData) => {
  return await Workspace.create(workspaceData);
};

/**
 * Get all workspaces with pagination
 * @param {Object} queryParams
 * @returns {Promise<Object>} Paginated result
 */
const getAllWorkspaces = async (queryParams) => {
  const filter = {};
  const options = {
    page: queryParams.page || 1,
    limit: queryParams.limit || 10,
    sortBy: queryParams.sortBy || "createdAt:desc",
  };

  return await Workspace.paginate(filter, options);
};

/**
 * Get workspace by ID
 * @param {string} workspaceId
 * @returns {Promise<Workspace>}
 */
const getWorkspaceById = async (workspaceId) => {
  return await Workspace.findById(workspaceId);
};

/**
 * Update workspace details
 * @param {string} workspaceId
 * @param {Object} updateData
 * @returns {Promise<Workspace>}
 */
const updateWorkspace = async (workspaceId, updateData) => {
  return await Workspace.findByIdAndUpdate(workspaceId, updateData, { new: true, runValidators: true });
};

/**
 * Soft delete a workspace
 * @param {string} workspaceId
 * @returns {Promise<void>}
 */
const deleteWorkspace = async (workspaceId) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new Error("Workspace not found");
  await workspace.softDelete();
};

module.exports = {
  createWorkspace,
  getAllWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
};
