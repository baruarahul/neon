const jwt = require("jsonwebtoken");
const User = require("../models/users.model");
const RoleService = require("../services/roles.service");
require("dotenv").config();

/**
 * Middleware to verify JWT token and authenticate user
 */
const authenticate = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-passwordHash"); // Attach user to request

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

/**
 * Middleware to check if user has a specific role (Admin Override)
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: "Forbidden: No user found" });
    }

    // Admin Override: Admin bypasses all role checks
    if (req.user.role === "admin") {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    next();
  };
};

/**
 * Middleware to check if user has a specific permission (Admin Override)
 */
const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(403).json({ message: "Forbidden: No user found" });
      }

      // Admin Override: Admin bypasses all permission checks
      if (req.user.roleId.name === "admin") {
        return next();
      }

      // Get user with inherited permissions
      const userWithPermissions = await RoleService.getRoleWithInheritedPermissions(req.user.roleId);
      const hasPermission = userWithPermissions.permissions.some(
        (perm) => perm.name === requiredPermission && perm.allowed
      );

      if (!hasPermission) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: "Permission check failed" });
    }
  };
};

module.exports = { authenticate, authorizeRoles, checkPermission };
