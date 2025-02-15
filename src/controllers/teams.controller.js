const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { validate } = require("../middleware/validate.middleware");
const teamService = require("../services/teams.service");
const { createTeam, updateTeam, getTeamById, deleteTeam } = require("../validations/team.validation");

/**
 * Create a new team
 */
const create = catchAsync(async (req, res) => {
  validate(createTeam, req);
  const team = await teamService.createTeam(req.body);
  res.status(httpStatus.CREATED).json({ success: true, data: team });
});

/**
 * Get all teams with pagination
 */
const getAll = catchAsync(async (req, res) => {
  const teams = await teamService.getAllTeams(req.query);
  res.json({ success: true, data: teams });
});

/**
 * Get a team by ID
 */
const getById = catchAsync(async (req, res) => {
  validate(getTeamById, req);
  const team = await teamService.getTeamById(req.params.teamId);
  if (!team) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: "Team not found" });
  }
  res.json({ success: true, data: team });
});

/**
 * Update a team
 */
const update = catchAsync(async (req, res) => {
  validate(updateTeam, req);
  const updatedTeam = await teamService.updateTeam(req.params.teamId, req.body);
  if (!updatedTeam) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: "Team not found" });
  }
  res.json({ success: true, data: updatedTeam });
});

/**
 * Soft delete a team
 */
const remove = catchAsync(async (req, res) => {
  validate(deleteTeam, req);
  await teamService.deleteTeam(req.params.teamId);
  res.json({ success: true, message: "Team deleted successfully" });
});

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
