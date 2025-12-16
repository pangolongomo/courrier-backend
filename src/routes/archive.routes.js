const express = require("express");
const ArchiveController = require("../controllers/archive.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

/**
 * @openapi
 * /archives:
 *   get:
 *     tags: [Archive]
 *     summary: Liste paginée des courriers archivés
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema: { type: integer, default: 1 }
 *       - name: limit
 *         in: query
 *         schema: { type: integer, default: 10 }
 *       - name: categorie
 *         in: query
 *         schema:
 *           type: string
 *           enum: [TRAITE, CLASSE_SANS_SUITE]
 *       - name: origineId
 *         in: query
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: archivedById
 *         in: query
 *         schema:
 *           type: string
 *           format: uuid
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Recherche par objet ou numéro de courrier
 *     responses:
 *       200:
 *         description: Liste paginée des archives
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get("/", ArchiveController.getArchivedCourriers);

module.exports = router;
