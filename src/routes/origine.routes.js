/**
 * @swagger
 * tags:
 *   name: Origine
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
 *     tags: [Origine]
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
 *     summary: Ajouter une nouvelle origine (ou récupérer si existe)
 *     tags: [Origine]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               libelle:
 *                 type: string
 *                 example: Ministère de l'Intérieur
 *     responses:
 *       201:
 *         description: Origine créée ou déjà existante
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Origine'
 *       400:
 *         description: Mauvaise requête (ex: libelle vide)
 *       500:
 *         description: Erreur serveur
 */

const router = require("express").Router();
const origineController = require("../controllers/origine.controller");

router.get("/", origineController.getOrigines);
router.post("/", origineController.createOrigine);

module.exports = router;
