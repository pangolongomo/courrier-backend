/**
 * @openapi
 * tags:
 *   name: Courrier
 *   description: Gestion des courriers
 */

/**
 * @openapi
 * /courriers:
 *   get:
 *     tags: [Courrier]
 *     summary: Liste tous les courriers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des courriers
 */

/**
 * @openapi
 * /courriers/paginated/all:
 *   get:
 *     tags: [Courrier]
 *     summary: Liste paginée des courriers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema: { type: integer, default: 1 }
 *       - name: limit
 *         in: query
 *         required: false
 *         schema: { type: integer, default: 10 }
 *       - name: typeId
 *         in: query
 *         required: false
 *         schema: { type: string, format: uuid }
 *         description: Filtrer par type de courrier
 *       - name: search
 *         in: query
 *         required: false
 *         schema: { type: string }
 *         description: Recherche dans objet et origine (insensible aux accents)
 *     responses:
 *       200:
 *         description: Liste paginée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page: { type: integer }
 *                 limit: { type: integer }
 *                 total: { type: integer }
 *                 totalPages: { type: integer }
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 */


/**
 * @openapi
 * /courriers/my:
 *   get:
 *     tags: [Courrier]
 *     summary: Récupère tous les courriers de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des courriers de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: string }
 *                   numero_courrier: { type: string }
 *                   origine: { type: string }
 *                   objet: { type: string }
 *                   date_signature: { type: string, format: date }
 *                   fichier_joint: { type: string }
 *                   pdfUrl: { type: string }
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
 * /courriers/my/paginated:
 *   get:
 *     tags: [Courrier]
 *     summary: Récupère les courriers paginés de l'utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Numéro de page (1-based)
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Nombre d'éléments par page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: typeId
 *         in: query
 *         required: false
 *         schema: { type: string, format: uuid }
 *         description: Filtrer par type de courrier
 *       - name: search
 *         in: query
 *         required: false
 *         schema: { type: string }
 *         description: Recherche dans objet et origine (insensible aux accents)
 *     responses:
 *       200:
 *         description: Liste paginée des courriers de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string }
 *                       numero_courrier: { type: string }
 *                       origine: { type: string }
 *                       objet: { type: string }
 *                       description: { type: string }
 *                       date_signature: { type: string, format: date }
 *                       fichier_joint: { type: string }
 *                       pdfUrl: { type: string }
 *                       estLu: { type: boolean }
 *                       createdAt: { type: string, format: date-time }
 *       401:
 *         description: Non authentifié / token invalide
 *       500:
 *         description: Erreur serveur
 */


/**
 * @openapi
 * /courriers/{id}:
 *   get:
 *     tags: [Courrier]
 *     summary: Récupère un courrier par ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Courrier trouvé }
 *       404: { description: Introuvable }
 */

/**
 * @openapi
 * /courriers:
 *   post:
 *     tags: [Courrier]
 *     summary: Crée un nouveau courrier
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [origine, objet, date_signature, fichier_joint, typeId, destUserId]
 *             properties:
 *               origineId:
 *                 type: string
 *                 description: ID d'une origine déjà existante
 *               origineText:
 *                 type: string
 *                 description: Texte d'une nouvelle origine s'il n'existe pas
 *               objet: { type: string }
 *               description: { type: string }
 *               date_signature: { type: string, format: date }
 *               fichier_joint:
 *                 type: string
 *                 format: binary
 *               typeId: { type: string }
 *               destUserId: { type: string }
 *     responses:
 *       201: { description: Courrier créé et notification envoyée }
 *       400: { description: Erreur validation }
 */

/**
 * @openapi
 * /courriers/{id}/validate:
 *   post:
 *     tags: [Courrier]
 *     summary: Valider un courrier et l’archiver comme traité
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentaire:
 *                 type: string
 *                 description: Commentaire optionnel lors de la validation
 *     responses:
 *       200:
 *         description: Courrier validé et archivé (TRAITE)
 *       400:
 *         description: Courrier déjà archivé ou statut invalide
 *       404:
 *         description: Courrier introuvable
 */

/**
 * @openapi
 * /courriers/{id}/priority:
 *   patch:
 *     tags: [Courrier]
 *     summary: Modifier la priorité d'un courrier
 *     security:
 *       - bearerAuth: []
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
 *             required: [priorite]
 *             properties:
 *               priorite:
 *                 type: string
 *                 enum: [NORMAL, URGENT, TRES_URGENT, CONFIDENTIEL]
 *                 description: Nouvelle priorité du courrier
 *     responses:
 *       200:
 *         description: Priorité mise à jour avec succès
 *       400:
 *         description: Priorité invalide
 *       404:
 *         description: Courrier introuvable
 */

/**
 * @openapi
 * /courriers/{id}/reject:
 *   post:
 *     tags: [Courrier]
 *     summary: Rejeter un courrier et le classer sans suite
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentaire:
 *                 type: string
 *                 description: Motif ou commentaire du rejet
 *     responses:
 *       200:
 *         description: Courrier rejeté et archivé (CLASSE_SANS_SUITE)
 *       400:
 *         description: Courrier déjà archivé
 *       404:
 *         description: Courrier introuvable
 */

/**
 * @openapi
 * /courriers/{id}:
 *   put:
 *     tags: [Courrier]
 *     summary: Met à jour un courrier existant
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               origine: { type: string }
 *               objet: { type: string }
 *               description: { type: string }
 *               date_signature: { type: string, format: date }
 *               fichier_joint:
 *                 type: string
 *                 format: binary
 *               typeId: { type: string }
 *               destUserId: { type: string }
 *               statutLibelle: { type: string }
 *     responses:
 *       200: { description: Courrier mis à jour }
 *       404: { description: Introuvable }
 */

/**
 * @openapi
 * /courriers/{id}:
 *   delete:
 *     tags: [Courrier]
 *     summary: Supprime un courrier
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Courrier supprimé }
 *       404: { description: Introuvable }
 */

const express = require("express");
const courrierController = require("../controllers/courrier.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", courrierController.getCourriers);
router.get("/paginated/all", courrierController.getCourriersPaginated);
router.get("/my/paginated", courrierController.getCourriersUserPaginated);
router.get("/my", courrierController.getCourriersUser);
router.get("/:id", courrierController.getCourrierById);

router.post("/", upload.single("fichier_joint"), courrierController.createCourrier);

router.post("/:id/validate", courrierController.validateCourrier);
router.post("/:id/reject", courrierController.rejectCourrier);
router.patch("/:id/priority", courrierController.updateCourrierPriority);


router.put("/:id", upload.single("fichier_joint"), courrierController.updateCourrier);

router.delete("/:id", courrierController.deleteCourrier);

module.exports = router;
