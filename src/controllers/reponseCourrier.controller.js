const reponseService = require("../services/reponseCourrier.service");

// Liste toutes les réponses
exports.getReponses = async (req, res) => {
  try {
    const data = await reponseService.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

// Récupérer une réponse par ID
exports.getReponseById = async (req, res) => {
  try {
    const data = await reponseService.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Réponse introuvable" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

// Créer une réponse
exports.createReponse = async (req, res) => {
  try {
    const data = await reponseService.create({
      date_signature: req.body.date_signature,
      fichier_joint: req.body.fichier_joint,
      courrierId: req.body.courrierId,
      responderId: req.user.id,
    });
    res.status(201).json(data);
  } catch (err) {
    console.error("Erreur création réponse :", err);
    res.status(400).json({ message: "Erreur lors de la création", err });
  }
};

// Mettre à jour une réponse
exports.updateReponse = async (req, res) => {
  try {
    const data = await reponseService.update(req.params.id, req.body);
    if (!data) return res.status(404).json({ message: "Réponse introuvable" });
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la modification", err });
  }
};

// Supprimer une réponse
exports.deleteReponse = async (req, res) => {
  try {
    const deleted = await reponseService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Réponse introuvable" });
    res.json({ message: "Réponse supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression", err });
  }
};
