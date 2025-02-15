const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { validate } = require("../middleware/validate.middleware");
const userService = require("../services/users.service");
const { createUser, updateUser, getUserById, deleteUser, updateUserRole } = require("../validations/user.validation");

/**
 * Create a new user
 */
const create = catchAsync(async (req, res) => {
  validate(createUser, req);
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).json({ success: true, data: user });
});

/**
 * Get all users with pagination
 */
const getAll = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers(req.query);
  res.json({ success: true, data: users });
});

/**
 * Get a user by ID
 */
const getById = catchAsync(async (req, res) => {
  validate(getUserById, req);
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: "User not found" });
  }
  res.json({ success: true, data: user });
});

/**
 * Update a user
 */
const update = catchAsync(async (req, res) => {
  validate(updateUser, req);
  const updatedUser = await userService.updateUser(req.params.userId, req.body);
  if (!updatedUser) {
    return res.status(httpStatus.NOT_FOUND).json({ success: false, message: "User not found" });
  }
  res.json({ success: true, data: updatedUser });
});

/**
 * Update user role
 */
const updateRole = catchAsync(async (req, res) => {
  validate(updateUserRole, req);
  const updatedUser = await userService.updateUserRole(req.params.userId, req.body.roleId);
  res.json({ success: true, data: updatedUser });
});

/**
 * Soft delete a user
 */
const remove = catchAsync(async (req, res) => {
  validate(deleteUser, req);
  await userService.deleteUser(req.params.userId);
  res.json({ success: true, message: "User deleted successfully" });
});

module.exports = {
  create,
  getAll,
  getById,
  update,
  updateRole,
  remove,
};
