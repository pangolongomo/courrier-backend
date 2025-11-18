/**
 * @openapi
 * tags:
 *   name: Roles
 *   description: Gestion des rôles
 */

/**
 * @openapi
 * /roles:
 *   get:
 *     tags: [Roles]
 *     summary: Liste tous les rôles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des rôles
 */
 
const express = require("express");
const roleController = require("../controllers/role.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", roleController.getRoles);

module.exports = router;
