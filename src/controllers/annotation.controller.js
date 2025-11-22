const annotationService = require("../services/annotation.service");
const courrierService = require("../services/courrier.service");

exports.createAnnotation = async (req, res) => {
  try {
    const { contenu, priorite, courrierId } = req.body;
    const userId = req.user.id; // l'ID récupéré via le token

    if (!contenu || !priorite || !courrierId) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // On récupère le courrier pour vérifier le destinataire
    const courrier = await courrierService.findById(courrierId);

    if (!courrier) return res.status(404).json({ message: "Courrier introuvable" });

    if (courrier.destUserId !== userId)
      return res.status(403).json({ message: "Vous n'êtes pas destinataire de ce courrier" });

    const annotation = await annotationService.create({
      contenu,
      priorite,
      courrierId,
      auteurId: userId,
    });

    res.status(201).json(annotation);
  } catch (err) {
    console.error("Erreur lors de l'annotation:", err);
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.getAnnotations = async (req, res) => {
  try {
    const { courrierId } = req.params;

    const data = await annotationService.findByCourrier(courrierId);

    res.json(data);
  } catch (err) {
    console.error("Erreur lors de la récupération:", err);
    res.status(500).json({ message: "Erreur serveur", err });
  }
};
