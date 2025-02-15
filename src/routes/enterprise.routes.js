const express = require("express");
const enterpriseController = require("../controllers/enterprise.controller");
const { authenticate, checkPermission } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticate, checkPermission("create_enterprises"), enterpriseController.create);
router.get("/", authenticate, checkPermission("view_enterprises"), enterpriseController.getAll);
router.get("/:enterpriseId", authenticate, checkPermission("view_enterprises"), enterpriseController.getById);
router.put("/:enterpriseId", authenticate, checkPermission("edit_enterprises"), enterpriseController.update);
router.delete("/:enterpriseId", authenticate, checkPermission("delete_enterprises"), enterpriseController.remove);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Enterprises
 *   description: API endpoints for managing enterprises
 */

/**
 * @swagger
 * /enterprises:
 *   post:
 *     summary: Create a new enterprise
 *     tags: [Enterprises]
 *     description: Create a new enterprise (Admin only)
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
 *               - ownerId
 *               - contactEmail
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tech Corp"
 *               ownerId:
 *                 type: string
 *                 example: "60e9f10c4f1a256d9c7a6b31"
 *               contactEmail:
 *                 type: string
 *                 format: email
 *                 example: "info@techcorp.com"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       201:
 *         description: Enterprise created successfully
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /enterprises:
 *   get:
 *     summary: Get all enterprises
 *     tags: [Enterprises]
 *     description: Retrieve a list of all enterprises
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of enterprises
 *       403:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /enterprises/{enterpriseId}:
 *   get:
 *     summary: Get a enterprise by ID
 *     tags: [Enterprises]
 *     description: Retrieve enterprise details by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enterpriseId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60e9f10c4f1a256d9c7a6b31"
 *     responses:
 *       200:
 *         description: Enterprise details retrieved
 *       404:
 *         description: Enterprise not found
 */

/**
 * @swagger
 * /enterprises/{enterpriseId}:
 *   put:
 *     summary: Update a enterprise
 *     tags: [Enterprises]
 *     description: Update enterprise details (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enterpriseId
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
 *                 example: "Updated Tech Corp"
 *               contactEmail:
 *                 type: string
 *                 format: email
 *                 example: "support@techcorp.com"
 *               phone:
 *                 type: string
 *                 example: "+9876543210"
 *     responses:
 *       200:
 *         description: Enterprise updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Enterprise not found
 */

/**
 * @swagger
 * /enterprises/{enterpriseId}:
 *   delete:
 *     summary: Delete a enterprise
 *     tags: [Enterprises]
 *     description: Delete a enterprise by ID (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enterpriseId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60e9f10c4f1a256d9c7a6b31"
 *     responses:
 *       200:
 *         description: Enterprise deleted successfully
 *       404:
 *         description: Enterprise not found
 */
