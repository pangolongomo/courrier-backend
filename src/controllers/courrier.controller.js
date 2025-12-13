const courrierService = require("../services/courrier.service");
const { putObject } = require("../utils/s3/putObject");
const { deleteObject } = require("../utils/s3/deleteObject");
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
      description: req.body.description,
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
    const existing = await courrierService.findById(
      req.params.id,
      req.user.userId
    );
    if (!existing)
      return res.status(404).json({ message: "Courrier introuvable" });

    const updateData = { ...req.body };

    if (req.file) {
      const result = await putObject(req.file.buffer, existing.s3_key);
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
    const courrier = await courrierService.findById(
      req.params.id,
      req.user.userId
    );
    if (!courrier)
      return res.status(404).json({ message: "Courrier introuvable" });

    if (courrier.s3_key) {
      await deleteObject(courrier.s3_key);
    }

    await courrierService.remove(req.params.id);
    res.json({ message: "Courrier supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression", err });
  }
};

exports.getCourriersPaginated = async (req, res) => {
  try {
    const userId = req.user.userId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const typeId = req.query.typeId;
    const search = req.query.search;

    const data = await courrierService.findAllPaginated(userId, page, limit, { typeId, search });

    // Ajout pdfUrl
    const finalRows = data.rows.map(c => addPdfUrl(c, req));

    res.json({
      page: data.page,
      limit: data.limit,
      total: data.total,
      totalPages: data.totalPages,
      rows: finalRows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.getCourriersUserPaginated = async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const data = await courrierService.findByUserPaginated(userId, page, limit);

    const finalRows = data.rows.map(c => addPdfUrl(c, req));

    res.json({
      page: data.page,
      limit: data.limit,
      total: data.total,
      totalPages: data.totalPages,
      rows: finalRows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

