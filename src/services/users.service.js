const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const User = require("../models/users.model");
const { getRoleWithInheritedPermissions, getRoleByName } = require("./roles.service");

/**
 * Create a new user with a default role and inherited permissions
 * @param {Object} userData
 * @returns {Promise<User>}
 */
const createUser = async (userData) => {
  if (await User.isEmailTaken(userData.email)) {
    throw new Error("Email is already taken");
  }

  if (await User.isPhoneTaken(userData.phone)) {
    throw new Error("Phone number is already taken");
  }

  userData.passwordHash = await bcrypt.hash(userData.password, 10);
  delete userData.password;

  let assignedRole;
  const enterpriseUsersCount = await User.countDocuments({ enterpriseId: userData.enterpriseId });

  if (enterpriseUsersCount === 0) {
    assignedRole = await getRoleByName("Enterprise Admin");
  } else {
    assignedRole = await getRoleByName(userData.roleName || "Team Member");
  }

  if (!assignedRole) {
    throw new Error("Role not found");
  }

  userData.roleId = assignedRole._id;

  // Fetch inherited permissions
  const roleWithPermissions = await getRoleWithInheritedPermissions(assignedRole._id);
  userData.permissionsOverride = roleWithPermissions.permissions;

  return await User.create(userData);
};

/**
 * Get all users with pagination
 * @param {Object} queryParams
 * @returns {Promise<Object>} Paginated result
 */
const getAllUsers = async (queryParams) => {
  const filter = {};
  const options = {
    page: queryParams.page || 1,
    limit: queryParams.limit || 10,
    sortBy: queryParams.sortBy || "createdAt:desc",
  };

  return await User.paginate(filter, options);
};

/**
 * Get user by ID
 * @param {string} userId
 * @returns {Promise<User>}
 */
const getUserById = async (userId) => {
  return await User.findById(userId).populate("roleId", "name permissions");
};

/**
 * Update user details
 * @param {string} userId
 * @param {Object} updateData
 * @returns {Promise<User>}
 */
const updateUser = async (userId, updateData) => {
  if (updateData.password) {
    updateData.passwordHash = await bcrypt.hash(updateData.password, 10);
    delete updateData.password;
  }

  return await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
};

/**
 * Soft delete a user
 * @param {string} userId
 * @returns {Promise<void>}
 */
const deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  await user.softDelete();
};

/**
 * Update user's role and inherited permissions
 * @param {string} userId
 * @param {string} newRoleId
 * @returns {Promise<User>}
 */
const updateUserRole = async (userId, newRoleId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const roleWithPermissions = await getRoleWithInheritedPermissions(newRoleId);
  user.roleId = newRoleId;
  user.permissionsOverride = roleWithPermissions.permissions;

  return await user.save();
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
};
