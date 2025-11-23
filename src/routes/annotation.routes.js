const router = require("express").Router();
const annotationController = require("../controllers/annotation.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Annotations
 *   description: Gestion des annotations sur les courriers
 */

/**
 * @swagger
 * /annotations:
 *   post:
 *     summary: Ajouter une annotation à un courrier (par le destinataire uniquement)
 *     tags: [Annotations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contenu
 *               - priorite
 *               - courrierId
 *             properties:
 *               contenu:
 *                 type: string
 *                 example: "Veuillez accélérer le traitement."
 *               priorite:
 *                 type: string
 *                 example: "haute"
 *               courrierId:
 *                 type: string
 *                 format: uuid
 *               userId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Annotation créée avec succès
 *       403:
 *         description: Non autorisé (seul le destinataire peut annoter)
 *       404:
 *         description: Courrier non trouvé
 */

/**
 * @swagger
 * /annotations/{courrierId}:
 *   get:
 *     summary: Récupérer les annotations d'un courrier
 *     tags: [Annotations]
 *     parameters:
 *       - in: path
 *         name: courrierId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des annotations
 */

router.post("/", authMiddleware, annotationController.createAnnotation);
router.get("/:courrierId", authMiddleware, annotationController.getAnnotations);

module.exports = router;
