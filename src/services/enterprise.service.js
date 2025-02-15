const httpStatus = require("http-status");
const Enterprise = require("../models/enterprise.model");
const Workspace = require("../models/workspaces.model");
const Team = require("../models/teams.model");

/**
 * Create a new enterprise with address, default workspace, and default team
 * @param {Object} enterpriseData
 * @returns {Promise<Enterprise>}
 */
const createEnterprise = async (enterpriseData) => {
  // Create enterprise with address
  const enterprise = await Enterprise.create({
    name: enterpriseData.name,
    ownerId: enterpriseData.ownerId,
    industry: enterpriseData.industry,
    website: enterpriseData.website,
    contactEmail: enterpriseData.contactEmail,
    phone: enterpriseData.phone,
    address: {
      street: enterpriseData.address.street,
      city: enterpriseData.address.city,
      state: enterpriseData.address.state,
      country: enterpriseData.address.country,
      postalCode: enterpriseData.address.postalCode,
    },
    settings: enterpriseData.settings || { allowCrossTeamVisibility: false, maxUsers: 100 },
    subscriptionPlan: enterpriseData.subscriptionPlan || "basic",
  });

  // Create default workspace
  const workspace = await Workspace.create({
    name: `${enterprise.name} - Default Workspace`,
    enterpriseId: enterprise._id,
    ownerId: enterprise.ownerId,
    allowedUserRoles: ["admin", "manager", "employee"],
    settings: { crossWorkspaceVisibility: false, autoRoleAssignment: true },
  });

  // Create default team in the default workspace
  await Team.create({
    name: `${enterprise.name} - Default Team`,
    enterpriseId: enterprise._id,
    workspaceId: workspace._id,
    createdBy: enterprise.ownerId,
    permissions: ["manage_team", "add_members"],
  });

  return enterprise;
};

/**
 * Get all enterprises with pagination
 * @param {Object} queryParams
 * @returns {Promise<Object>} Paginated result
 */
const getAllEnterprises = async (queryParams) => {
  const filter = {};
  const options = {
    page: queryParams.page || 1,
    limit: queryParams.limit || 10,
    sortBy: queryParams.sortBy || "createdAt:desc",
  };

  return await Enterprise.paginate(filter, options);
};

/**
 * Get enterprise by ID
 * @param {string} enterpriseId
 * @returns {Promise<Enterprise>}
 */
const getEnterpriseById = async (enterpriseId) => {
  return await Enterprise.findById(enterpriseId);
};

/**
 * Update enterprise details
 * @param {string} enterpriseId
 * @param {Object} updateData
 * @returns {Promise<Enterprise>}
 */
const updateEnterprise = async (enterpriseId, updateData) => {
  return await Enterprise.findByIdAndUpdate(enterpriseId, updateData, { new: true, runValidators: true });
};

/**
 * Soft delete a enterprise
 * @param {string} enterpriseId
 * @returns {Promise<void>}
 */
const deleteEnterprise = async (enterpriseId) => {
  const enterprise = await Enterprise.findById(enterpriseId);
  if (!enterprise) throw new Error("Enterprise not found");
  await enterprise.softDelete();
};

module.exports = {
  createEnterprise,
  getAllEnterprises,
  getEnterpriseById,
  updateEnterprise,
  deleteEnterprise,
};
