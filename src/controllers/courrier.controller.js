const courrierService = require("../services/courrier.service");

exports.getCourriers = async (req, res) => {
  try {
    const data = await courrierService.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.getCourrierById = async (req, res) => {
  try {
    const data = await courrierService.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Courrier introuvable" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.createCourrier = async (req, res) => {
  try {
    const data = await courrierService.create({
      origine: req.body.origine,
      objet: req.body.objet,
      date_signature: req.body.date_signature,
      fichier_joint: req.body.fichier_joint,
      typeId: req.body.typeId,
      destUserId: req.body.destUserId,
      creatorId: req.user.userId,
    });

    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la création", err });
  }
};

exports.updateCourrier = async (req, res) => {
  try {
    const data = await courrierService.update(req.params.id, req.body);

    if (!data) return res.status(404).json({ message: "Courrier introuvable" });
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la modification", err });
  }
};

exports.deleteCourrier = async (req, res) => {
  try {
    const deleted = await courrierService.remove(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Courrier introuvable" });
    res.json({ message: "Courrier supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression", err });
  }
};
