/**
 * @swagger
 * tags:
 *   name: Origines
 *   description: Gestion des origines de courriers
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Origine:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         libelle:
 *           type: string
 *           example: Ministère des Finances
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /origines:
 *   get:
 *     summary: Récupérer la liste des origines
 *     tags: [Origines]
 *     responses:
 *       200:
 *         description: Liste des origines
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Origine'
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /origines:
 *   post:
 *     summary: Créer une nouvelle origine
 *     tags: [Origines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - libelle
 *             properties:
 *               libelle:
 *                 type: string
 *                 example: "string"
 *     responses:
 *       201:
 *         description: Origine créée avec succès
 *       400:
 *         description: "Mauvaise requête, libelle vide"
 *       409:
 *         description: L'origine existe déjà
 */

/**
 * @swagger
 * /origines/{id}:
 *   put:
 *     summary: Mettre à jour une origine
 *     tags: [Origines]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - libelle
 *             properties:
 *               libelle:
 *                 type: string
 *                 example: "Nouveau libellé"
 *     responses:
 *       200:
 *         description: Origine mise à jour avec succès
 *       400:
 *         description: "Mauvaise requête, libelle vide"
 *       404:
 *         description: Origine non trouvée
 *       409:
 *         description: L'origine existe déjà
 */

const router = require("express").Router();
const origineController = require("../controllers/origine.controller");

router.get("/", origineController.getOrigines);
router.post("/", origineController.createOrigine);
router.put("/:id", origineController.updateOrigine);

module.exports = router;
