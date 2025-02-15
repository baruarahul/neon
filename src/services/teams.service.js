const httpStatus = require("http-status");
const Team = require("../models/teams.model");

/**
 * Create a team
 * @param {Object} teamData
 * @returns {Promise<Team>}
 */
const createTeam = async (teamData) => {
  return await Team.create(teamData);
};

/**
 * Get all teams with pagination
 * @param {Object} queryParams
 * @returns {Promise<Object>} Paginated result
 */
const getAllTeams = async (queryParams) => {
  const filter = {};
  const options = {
    page: queryParams.page || 1,
    limit: queryParams.limit || 10,
    sortBy: queryParams.sortBy || "createdAt:desc",
  };

  return await Team.paginate(filter, options);
};

/**
 * Get team by ID
 * @param {string} teamId
 * @returns {Promise<Team>}
 */
const getTeamById = async (teamId) => {
  return await Team.findById(teamId);
};

/**
 * Update team details
 * @param {string} teamId
 * @param {Object} updateData
 * @returns {Promise<Team>}
 */
const updateTeam = async (teamId, updateData) => {
  return await Team.findByIdAndUpdate(teamId, updateData, { new: true, runValidators: true });
};

/**
 * Soft delete a team
 * @param {string} teamId
 * @returns {Promise<void>}
 */
const deleteTeam = async (teamId) => {
  const team = await Team.findById(teamId);
  if (!team) throw new Error("Team not found");
  await team.softDelete();
};

module.exports = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
};
