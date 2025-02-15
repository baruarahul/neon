const express = require("express");
const roleController = require("../controllers/roles.controller");
const { authenticate, checkPermission } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticate, checkPermission("manage_roles"), roleController.createRole);
router.get("/:roleId", authenticate, checkPermission("view_roles"), roleController.getRoleWithPermissions);
router.put("/:roleId", authenticate, checkPermission("manage_roles"), roleController.updateRole);
router.delete("/:roleId", authenticate, checkPermission("delete_roles"), roleController.deleteRole);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: API endpoints for managing user roles and permissions
 */

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     description: Create a new role with specific permissions (Admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - level
 *               - permissions
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Manager"
 *               level:
 *                 type: string
 *                 enum: ["channel_partner", "reseller", "enterprise", "user", "device", "admin"]
 *                 example: "admin"
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "manage_users"
 *                     allowed:
 *                       type: boolean
 *                       example: true
 *     responses:
 *       201:
 *         description: Role created successfully
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /roles/{roleId}:
 *   get:
 *     summary: Get a role by ID
 *     tags: [Roles]
 *     description: Retrieve details of a role including permissions
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60e9f10c4f1a256d9c7a6b31"
 *     responses:
 *       200:
 *         description: Role details retrieved successfully
 *       404:
 *         description: Role not found
 */

/**
 * @swagger
 * /roles/{roleId}:
 *   put:
 *     summary: Update a role
 *     tags: [Roles]
 *     description: Update role details and permissions (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60e9f10c4f1a256d9c7a6b31"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Senior Manager"
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "manage_reports"
 *                     allowed:
 *                       type: boolean
 *                       example: true
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Role not found
 */

/**
 * @swagger
 * /roles/{roleId}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
 *     description: Delete a role by ID (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60e9f10c4f1a256d9c7a6b31"
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 */
