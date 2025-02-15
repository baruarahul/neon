const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const roleService = require("../services/roles.service");

/**
 * Create a new role
 */
const createRole = catchAsync(async (req, res) => {
  const role = await roleService.createRole(req.body);
  res.status(httpStatus.CREATED).json({ success: true, data: role });
});

/**
 * Get role with inherited permissions
 */
const getRoleWithPermissions = catchAsync(async (req, res) => {
  const role = await roleService.getRoleWithInheritedPermissions(req.params.roleId);
  res.json({ success: true, data: role });
});

/**
 * Update role details and permissions
 */
const updateRole = catchAsync(async (req, res) => {
  const updatedRole = await roleService.updateRole(req.params.roleId, req.body);
  res.json({ success: true, data: updatedRole });
});

/**
 * Delete a role
 */
const deleteRole = catchAsync(async (req, res) => {
  await roleService.deleteRole(req.params.roleId);
  res.json({ success: true, message: "Role deleted successfully" });
});

module.exports = {
  createRole,
  getRoleWithPermissions,
  updateRole,
  deleteRole,
};
