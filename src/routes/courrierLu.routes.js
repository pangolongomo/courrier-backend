/**
 * @openapi
 * tags:
 *   name: CourrierLu
 *   description: Gestion des lectures des courriers
 */

/**
 * @openapi
 * /courrier-lu/{courrierId}/read:
 *   post:
 *     tags: [CourrierLu]
 *     summary: Marque un courrier comme lu pour l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: courrierId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Courrier marqué comme lu
 *       404:
 *         description: Courrier introuvable
 */

/**
 * @openapi
 * /courrier-lu/{courrierId}/reads:
 *   get:
 *     tags: [CourrierLu]
 *     summary: Récupère tous les utilisateurs ayant lu le courrier
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: courrierId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Liste des utilisateurs ayant lu le courrier
 *       404:
 *         description: Courrier introuvable
 */

const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const courrierLuController = require("../controllers/courrierLu.controller");

const router = express.Router();

router.use(authMiddleware);


router.post("/:courrierId/read", courrierLuController.markCourrierAsRead);


router.get("/:courrierId/reads", courrierLuController.getReadsForCourrier);

module.exports = router;
