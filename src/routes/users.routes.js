const express = require("express");
const userController = require("../controllers/users.controller");
const { authenticate, checkPermission } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticate, checkPermission("create_users"), userController.create);
router.get("/", authenticate, checkPermission("view_users"), userController.getAll);
router.get("/:userId", authenticate, checkPermission("view_users"), userController.getById);
router.put("/:userId", authenticate, checkPermission("edit_users"), userController.update);
router.delete("/:userId", authenticate, checkPermission("delete_users"), userController.remove);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     description: Create a new user in the system (Admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - phone
 *               - roleId
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "StrongP@ss123"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               roleId:
 *                 type: string
 *                 example: "60e9f10c4f1a256d9c7a6b31"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     description: Retrieve a list of all users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *       403:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     description: Retrieve user details by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60e9f10c4f1a256d9c7a6b31"
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     description: Update user details (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               fullName:
 *                 type: string
 *                 example: "Updated John Doe"
 *               phone:
 *                 type: string
 *                 example: "+9876543210"
 *               roleId:
 *                 type: string
 *                 example: "60e9f10c4f1a256d9c7a6b32"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     description: Delete a user by ID (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "60e9f10c4f1a256d9c7a6b31"
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
