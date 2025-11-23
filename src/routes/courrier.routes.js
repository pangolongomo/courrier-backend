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
const uploadMiddleware = require("../middlewares/upload.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", courrierController.getCourriers);
router.get("/my", courrierController.getCourriersUser);
router.get("/:id", courrierController.getCourrierById);

router.post("/", uploadMiddleware.single("fichier_joint"), (req, res) => {
  if (req.file) req.body.fichier_joint = req.file.path; //
  return courrierController.createCourrier(req, res);
});

router.put("/:id", uploadMiddleware.single("fichier_joint"), (req, res) => {
  if (req.file) req.body.fichier_joint = req.file.path;
  return courrierController.updateCourrier(req, res);
});

router.delete("/:id", courrierController.deleteCourrier);

module.exports = router;
