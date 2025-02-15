const express = require("express");
const teamController = require("../controllers/teams.controller");
const { authenticate, checkPermission } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticate, checkPermission("create_teams"), teamController.create);
router.get("/", authenticate, checkPermission("view_teams"), teamController.getAll);
router.get("/:teamId", authenticate, checkPermission("view_teams"), teamController.getById);
router.put("/:teamId", authenticate, checkPermission("edit_teams"), teamController.update);
router.delete("/:teamId", authenticate, checkPermission("delete_teams"), teamController.remove);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: API endpoints for managing teams
 */

/**
 * @swagger
 * /teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     description: Create a new team in the system (Admin only)
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
 *               - createdBy
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Development Team"
 *               enterpriseId:
 *                 type: string
 *                 example: "60e9f10c4f1a256d9c7a6b31"
 *               createdBy:
 *                 type: string
 *                 example: "60e9f10c4f1a256d9c7a6b32"
 *     responses:
 *       201:
 *         description: Team created successfully
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /teams:
 *   get:
 *     summary: Get all teams
 *     tags: [Teams]
 *     description: Retrieve a list of all teams
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of teams
 *       403:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /teams/{teamId}:
 *   get:
 *     summary: Get a team by ID
 *     tags: [Teams]
 *     description: Retrieve team details by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60e9f10c4f1a256d9c7a6b31"
 *     responses:
 *       200:
 *         description: Team details retrieved successfully
 *       404:
 *         description: Team not found
 */

/**
 * @swagger
 * /teams/{teamId}:
 *   put:
 *     summary: Update a team
 *     tags: [Teams]
 *     description: Update team details (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
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
 *                 example: "Updated Development Team"
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "60e9f10c4f1a256d9c7a6b32"
 *     responses:
 *       200:
 *         description: Team updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Team not found
 */

/**
 * @swagger
 * /teams/{teamId}:
 *   delete:
 *     summary: Delete a team
 *     tags: [Teams]
 *     description: Delete a team by ID (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60e9f10c4f1a256d9c7a6b31"
 *     responses:
 *       200:
 *         description: Team deleted successfully
 *       404:
 *         description: Team not found
 */
