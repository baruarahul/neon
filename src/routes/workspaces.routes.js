const express = require("express");
const workspaceController = require("../controllers/workspaces.controller");
const { authenticate, checkPermission } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticate, checkPermission("create_workspaces"), workspaceController.create);
router.get("/", authenticate, checkPermission("view_workspaces"), workspaceController.getAll);
router.get("/:workspaceId", authenticate, checkPermission("view_workspaces"), workspaceController.getById);
router.put("/:workspaceId", authenticate, checkPermission("edit_workspaces"), workspaceController.update);
router.delete("/:workspaceId", authenticate, checkPermission("delete_workspaces"), workspaceController.remove);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Workspaces
 *   description: API endpoints for managing workspaces
 */

/**
 * @swagger
 * /workspaces:
 *   post:
 *     summary: Create a new workspace
 *     tags: [Workspaces]
 *     description: Create a new workspace in the system (Admin only)
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
 *               - enterpriseId
 *               - ownerId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Marketing Workspace"
 *               enterpriseId:
 *                 type: string
 *                 example: "60e9f10c4f1a256d9c7a6b31"
 *               ownerId:
 *                 type: string
 *                 example: "60e9f10c4f1a256d9c7a6b32"
 *     responses:
 *       201:
 *         description: Workspace created successfully
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /workspaces:
 *   get:
 *     summary: Get all workspaces
 *     tags: [Workspaces]
 *     description: Retrieve a list of all workspaces
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of workspaces
 *       403:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /workspaces/{workspaceId}:
 *   get:
 *     summary: Get a workspace by ID
 *     tags: [Workspaces]
 *     description: Retrieve workspace details by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60e9f10c4f1a256d9c7a6b31"
 *     responses:
 *       200:
 *         description: Workspace details retrieved successfully
 *       404:
 *         description: Workspace not found
 */

/**
 * @swagger
 * /workspaces/{workspaceId}:
 *   put:
 *     summary: Update a workspace
 *     tags: [Workspaces]
 *     description: Update workspace details (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
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
 *                 example: "Updated Marketing Workspace"
 *               settings:
 *                 type: object
 *                 properties:
 *                   crossWorkspaceVisibility:
 *                     type: boolean
 *                     example: true
 *                   autoRoleAssignment:
 *                     type: boolean
 *                     example: false
 *     responses:
 *       200:
 *         description: Workspace updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Workspace not found
 */

/**
 * @swagger
 * /workspaces/{workspaceId}:
 *   delete:
 *     summary: Delete a workspace
 *     tags: [Workspaces]
 *     description: Delete a workspace by ID (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60e9f10c4f1a256d9c7a6b31"
 *     responses:
 *       200:
 *         description: Workspace deleted successfully
 *       404:
 *         description: Workspace not found
 */
