/**
 * @openapi
 * tags:
 *   name: Dashboard
 *   description: Statistiques et dossiers des agents
 */

/**
 * @openapi
 * /dashboard/stats:
 *   get:
 *     tags: [Dashboard]
 *     summary: Statistiques globales des courriers pour l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques retournées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalTraites: { type: integer }
 *                 totalRejetes: { type: integer }
 *                 totalEnCours: { type: integer }
 *                 totalLu: { type: integer }
 *                 totalNonLu: { type: integer }
 */

/**
 * @openapi
 * /dashboard/agents-en-cours:
 *   get:
 *     tags: [Dashboard]
 *     summary: Liste des agents ayant des dossiers en cours
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des agents avec le nombre de dossiers en cours
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: string }
 *                   nom: { type: string }
 *                   prenom: { type: string }
 *                   dossiersEnCours: { type: integer }
 */

/**
 * @openapi
 * /dashboard/agents/{agentId}/dossiers:
 *   get:
 *     tags: [Dashboard]
 *     summary: Liste des courriers en cours pour un agent spécifique
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: agentId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *         description: ID de l'agent
 *     responses:
 *       200:
 *         description: Courriers en cours pour l'agent
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: string }
 *                   numero_courrier: { type: string }
 *                   objet: { type: string }
 *                   date_signature: { type: string, format: date }
 *                   fichier_joint: { type: string }
 *                   pdfUrl: { type: string }
 *                   estLu: { type: boolean }
 *                   type:
 *                     type: object
 *                     properties:
 *                       id: { type: string }
 *                       libelle: { type: string }
 *                   creator:
 *                     type: object
 *                     properties:
 *                       id: { type: string }
 *                       nom: { type: string }
 *                   origine:
 *                     type: object
 *                     properties:
 *                       id: { type: string }
 *                       libelle: { type: string }
 *                   annotations:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id: { type: string }
 *                         contenu: { type: string }
 *                         auteur:
 *                           type: object
 *                           properties:
 *                             id: { type: string }
 *                             nom: { type: string }
 *                   reponses:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id: { type: string }
 *                         fichier_joint: { type: string }
 */

/**
 * @openapi
 * /dashboard/totaux-globaux:
 *   get:
 *     tags: [Dashboard]
 *     summary: Totaux globaux des courriers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Totaux globaux
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCourrierEntrant:
 *                   type: integer
 *                 totalCourrierSortant:
 *                   type: integer
 *                 totalCourrier:
 *                   type: integer
 */

/**
 * @openapi
 * /dashboard/statuts-globaux:
 *   get:
 *     tags: [Dashboard]
 *     summary: Totaux globaux des courriers par statut
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Totaux globaux par statut
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCourrierValide:
 *                   type: integer
 *                   example: 25
 *                 totalCourrierRejete:
 *                   type: integer
 *                   example: 7
 *                 totalCourrierEnCours:
 *                   type: integer
 *                   example: 13
 */

/**
 * @openapi
 * /dashboard/destinataires/traites-non-traites:
 *   get:
 *     tags: [Dashboard]
 *     summary: Totaux des courriers traités et non traités par destinataire
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques par destinataire
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   nom:
 *                     type: string
 *                   prenom:
 *                     type: string
 *                   totalTraites:
 *                     type: integer
 *                   totalNonTraites:
 *                     type: integer
 */


const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const dashboardController = require("../controllers/dashboard.controller");

router.use(authMiddleware);

// Statistiques globales pour l'utilisateur connecté
router.get("/stats", dashboardController.getStats);

// Liste des agents ayant des dossiers en cours
router.get("/agents-en-cours", dashboardController.getAgentsEnCours);

router.get("/totaux-globaux", dashboardController.getGlobalCourrierTotals);

// Totaux globaux des courriers par statut
router.get("/statuts-globaux", dashboardController.getGlobalCourrierStatuts);

// Courriers traités / non traités par destinataire
router.get("/destinataires/traites-non-traites", dashboardController.getCourrierTraiteParDestinataire);

// Dossiers en cours pour un agent spécifique
router.get("/agents/:agentId/dossiers", dashboardController.getDossiersAgent);

module.exports = router;
