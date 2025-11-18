const reponseService = require("../services/reponseCourrier.service");

exports.getReponses = async (req, res) => {
  try {
    const data = await reponseService.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.getReponseById = async (req, res) => {
  try {
    const data = await reponseService.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Réponse introuvable" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.createReponse = async (req, res) => {
  try {
    const fichier_joint = req.file ? req.file.path : req.body.fichier_joint;

    const date_signature = req.body.date_signature
      ? new Date(req.body.date_signature)
      : undefined;

    const data = await reponseService.create({
      date_signature,
      fichier_joint,
      courrierId: req.body.courrierId,
      responderId: req.user.userId,
    });

    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la création", err });
  }
};

exports.updateReponse = async (req, res) => {
  try {
    if (req.file) req.body.fichier_joint = req.file.path;

    if (req.body.date_signature) {
      req.body.date_signature = new Date(req.body.date_signature);
    }

    const data = await reponseService.update(req.params.id, req.body);
    if (!data) return res.status(404).json({ message: "Réponse introuvable" });
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la modification", err });
  }
};

exports.deleteReponse = async (req, res) => {
  try {
    const deleted = await reponseService.remove(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Réponse introuvable" });
    res.json({ message: "Réponse supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression", err });
  }
};
