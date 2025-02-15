const Role = require("../models/roles.model");

/**
 * Create a new role
 * @param {Object} roleData
 * @returns {Promise<Role>}
 */
const createRole = async (roleData) => {
  const existingRole = await Role.findOne({ name: roleData.name });
  if (existingRole) throw new Error("Role with this name already exists");

  const role = new Role(roleData);
  return role.save();
};

/**
 * Update role details and permissions dynamically
 * @param {string} roleId
 * @param {Object} updates
 * @returns {Promise<Role>}
 */
const updateRole = async (roleId, updates) => {
  const role = await Role.findById(roleId);
  if (!role) throw new Error("Role not found");

  Object.assign(role, updates);
  await role.save();

  // Propagate inherited permission changes
  await updateInheritedPermissions(roleId);

  // Update all users with this role
  await updateUsersWithRole(roleId);

  return role;
};

/**
 * Update all users with a modified role
 * @param {string} roleId
 * @returns {Promise<void>}
 */
const updateUsersWithRole = async (roleId) => {
  const users = await User.find({ roleId });

  for (const user of users) {
    const roleWithPermissions = await getRoleWithInheritedPermissions(roleId);
    user.permissionsOverride = roleWithPermissions.permissions;
    await user.save();
  }
};

/**
 * Get role with inherited permissions
 * @param {string} roleId
 * @returns {Promise<Role>}
 */
const getRoleWithInheritedPermissions = async (roleId) => {
  let role = await Role.findById(roleId).lean();
  if (!role) throw new Error("Role not found");

  let inheritedPermissions = new Map();
  let currentRole = role;

  while (currentRole && currentRole.parentRoleId) {
    const parentRole = await Role.findById(currentRole.parentRoleId).lean();
    if (!parentRole) break;

    parentRole.permissions.forEach((perm) => {
      if (!inheritedPermissions.has(perm.name)) {
        inheritedPermissions.set(perm.name, perm.allowed);
      }
    });

    currentRole = parentRole;
  }

  role.permissions.forEach((perm) => {
    inheritedPermissions.set(perm.name, perm.allowed);
  });

  return {
    ...role,
    permissions: Array.from(inheritedPermissions, ([name, allowed]) => ({ name, allowed })),
  };
};

/**
 * Update inherited permissions for all child roles
 * @param {string} roleId - Parent role ID
 * @returns {Promise<void>}
 */
const updateInheritedPermissions = async (roleId) => {
  const rolesToUpdate = await Role.find({ parentRoleId: roleId });

  for (const role of rolesToUpdate) {
    const updatedRole = await getRoleWithInheritedPermissions(role._id);
    role.permissions = updatedRole.permissions;
    await role.save();

    // Recursively update all children
    await updateInheritedPermissions(role._id);
  }
};

/**
 * Delete a role (soft delete)
 * @param {string} roleId
 * @returns {Promise<void>}
 */
const deleteRole = async (roleId) => {
  const role = await Role.findById(roleId);
  if (!role) throw new Error("Role not found");

  await role.softDelete();
};

module.exports = {
  createRole,
  updateRole,
  getRoleWithInheritedPermissions,
  deleteRole,
};
