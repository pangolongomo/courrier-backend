const courrierService = require("../services/courrier.service");

const addPdfUrl = (courrier, req) => ({
  ...courrier,
  pdfUrl: courrier.fichier_joint
    ? `${req.protocol}://${req.get('host')}/${courrier.fichier_joint.replace(/\\/g, '/')}`
    : null,
});

exports.getCourriers = async (req, res) => {
  try {
    const data = await courrierService.findAll();
    const result = data.map(c => addPdfUrl(c, req));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.getCourrierById = async (req, res) => {
  try {
    const data = await courrierService.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Courrier introuvable" });
    res.json(addPdfUrl(data, req));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.getCourriersUser = async (req, res) => {
  try {
    const userId = req.user.userId; // récupéré depuis le token
    const data = await courrierService.findByUser(userId);

    const result = data.map(c => addPdfUrl(c, req));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.createCourrier = async (req, res) => {
  try {
    const data = await courrierService.create({
      origineId: req.body.origineId,
      origineText: req.body.origineText,
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
