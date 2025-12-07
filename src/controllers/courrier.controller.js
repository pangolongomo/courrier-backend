const courrierService = require("../services/courrier.service");
const { putObject } = require("../utils/s3/putObject");
const { generateFileName } = require("../utils/fileNaming");

const addPdfUrl = (courrier) => ({
  ...courrier,
  pdfUrl: courrier.fichier_joint || null,
});

exports.getCourriers = async (req, res) => {
  try {
    const userId = req.user.userId;
    const data = await courrierService.findAll(userId);
    const result = data.map((c) => addPdfUrl(c));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.getCourrierById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const data = await courrierService.findById(req.params.id, userId);
    if (!data) return res.status(404).json({ message: "Courrier introuvable" });
    res.json(addPdfUrl(data));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.getCourriersUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const data = await courrierService.findByUser(userId);
    const result = data.map((c) => addPdfUrl(c));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.createCourrier = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Le fichier PDF est requis" });
    }

    const fileName = generateFileName(req.file.originalname);
    const result = await putObject(req.file.buffer, fileName);

    const data = await courrierService.create({
      origineId: req.body.origineId,
      origineText: req.body.origineText,
      objet: req.body.objet,
      date_signature: req.body.date_signature,
      fichier_joint: result?.url,
      s3_key: result?.key,
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
    const existing = await courrierService.findById(req.params.id, req.user.userId);
    if (!existing) return res.status(404).json({ message: "Courrier introuvable" });

    const updateData = { ...req.body };

    if (req.file) {
      const fileName = existing.s3_key || generateFileName(req.file.originalname);
      const result = await putObject(req.file.buffer, fileName);
      updateData.fichier_joint = result?.url;
      updateData.s3_key = result?.key;
    }

    const data = await courrierService.update(req.params.id, updateData);
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
