/**
 * @openapi
 * tags:
 *   name: TypeCourrier
 *   description: Gestion des types de courrier
 */

/**
 * @openapi
 * /type-courriers:
 *   get:
 *     tags: [TypeCourrier]
 *     summary: Liste tous les types de courrier
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des types
 */

/**
 * @openapi
 * /type-courriers/{id}:
 *   get:
 *     tags: [TypeCourrier]
 *     summary: Récupère un type par ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Type trouvé }
 *       404: { description: Introuvable }
 */

/**
 * @openapi
 * /type-courriers:
 *   post:
 *     tags: [TypeCourrier]
 *     summary: Création d'un type de courrier
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [libelle]
 *             properties:
 *               libelle: { type: string }
 *     responses:
 *       201: { description: Créé }
 *       400: { description: Erreur validation }
 */

/**
 * @openapi
 * /type-courriers/{id}:
 *   put:
 *     tags: [TypeCourrier]
 *     summary: Modifier un type de courrier
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               libelle: { type: string }
 *     responses:
 *       200: { description: Mis à jour }
 *       404: { description: Introuvable }
 */

/**
 * @openapi
 * /type-courriers/{id}:
 *   delete:
 *     tags: [TypeCourrier]
 *     summary: Supprimer un type de courrier
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Supprimé }
 *       404: { description: Introuvable }
 */

const express = require("express");
const typeController = require("../controllers/typeCourrier.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, typeController.getTypes);
router.get("/:id", authMiddleware, typeController.getTypeById);
router.post("/", authMiddleware, typeController.createType);
router.put("/:id", authMiddleware, typeController.updateType);
router.delete("/:id", authMiddleware, typeController.deleteType);

module.exports = router;
