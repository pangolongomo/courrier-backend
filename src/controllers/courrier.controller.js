const courrierService = require("../services/courrier.service");
const { putObject } = require("../utils/s3/putObject");
const { deleteObject } = require("../utils/s3/deleteObject");
const { generateFileName } = require("../utils/fileNaming");

const { getSignedUrl } = require("../utils/s3/getObject");

const addPdfUrl = async (courrier) => {
  const { s3_key, ...courrierData } = courrier;

  if (!s3_key) {
    return { ...courrierData, pdfUrl: null };
  }

  const pdfUrl = await getSignedUrl(s3_key, 300); // 5 min
  return { ...courrierData, pdfUrl };
};

exports.getCourriers = async (req, res) => {
  try {
    const userId = req.user.userId;
    const data = await courrierService.findAll(userId);
    const result = await Promise.all(data.map((c) => addPdfUrl(c)));
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
    res.json(await addPdfUrl(data));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.getCourriersUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const data = await courrierService.findByUser(userId);
    const result = await Promise.all(data.map((c) => addPdfUrl(c)));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Le fichier est requis" });
    }

    const fileName = generateFileName(req.file.originalname);
    const result = await putObject(req.file.buffer, fileName);

    res.status(200).json({
      s3_key: result?.key,
      nom_fichier: req.file.originalname,
      url: result?.url,
    });
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de l'upload", err });
  }
};

exports.createCourrier = async (req, res) => {
  try {
    let s3_key, nom_fichier;

    if (req.body.s3_key) {
      s3_key = req.body.s3_key;
      nom_fichier = req.body.nom_fichier;
    } else if (req.file) {
      const fileName = generateFileName(req.file.originalname);
      const result = await putObject(req.file.buffer, fileName);
      s3_key = result?.key;
      nom_fichier = req.file.originalname;
    } else {
      return res.status(400).json({ message: "Le fichier PDF est requis" });
    }

    const data = await courrierService.create({
      origineId: req.body.origineId,
      origineText: req.body.origineText,
      objet: req.body.objet,
      description: req.body.description,
      date_signature: req.body.date_signature,
      s3_key,
      nom_fichier,
      typeId: req.body.typeId,
      destUserId: req.body.destUserId,
      creatorId: req.user.userId,
    });

    res.status(201).json({ ...(await addPdfUrl(data)), estLu: false });
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la création", err });
  }
};

exports.updateCourrier = async (req, res) => {
  try {
    const existing = await courrierService.findById(
      req.params.id,
      req.user.userId,
    );
    if (!existing)
      return res.status(404).json({ message: "Courrier introuvable" });

    const updateData = { ...req.body };

    // Handle file update: pre-uploaded or direct upload
    if (req.body.s3_key) {
      // Pre-uploaded file
      updateData.s3_key = req.body.s3_key;
      updateData.nom_fichier = req.body.nom_fichier;
    } else if (req.file) {
      // Direct file upload
      const fileName = generateFileName(req.file.originalname);
      const result = await putObject(req.file.buffer, fileName);
      updateData.s3_key = result?.key;
      updateData.nom_fichier = req.file.originalname;
    }
    // If neither, keep existing file (no file change)

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
      req.user.userId,
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

    const data = await courrierService.findAllPaginated(userId, page, limit, {
      typeId,
      search,
    });

    // Ajout pdfUrl
    const finalRows = await Promise.all(data.rows.map((c) => addPdfUrl(c)));

    res.json({
      page: data.page,
      limit: data.limit,
      total: data.total,
      totalPages: data.totalPages,
      rows: finalRows,
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
    const typeId = req.query.typeId;
    const search = req.query.search;

    const data = await courrierService.findByUserPaginated(
      userId,
      page,
      limit,
      { typeId, search },
    );

    const finalRows = await Promise.all(data.rows.map((c) => addPdfUrl(c)));

    res.json({
      page: data.page,
      limit: data.limit,
      total: data.total,
      totalPages: data.totalPages,
      rows: finalRows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.validateCourrier = async (req, res) => {
  try {
    await courrierService.validateCourrier(
      req.params.id,
      req.user.userId,
      req.body.commentaire,
    );

    res.json({ message: "Courrier validé et archivé (Traité)" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.rejectCourrier = async (req, res) => {
  try {
    await courrierService.rejectCourrier(
      req.params.id,
      req.user.userId,
      req.body.commentaire,
    );

    res.json({ message: "Courrier rejeté et classé sans suite" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateCourrierPriority = async (req, res) => {
  try {
    const { priorite } = req.body;
    const validPriorities = ["NORMAL", "URGENT", "TRES_URGENT", "CONFIDENTIEL"];

    if (!validPriorities.includes(priorite)) {
      return res.status(400).json({ message: "Priorité invalide" });
    }

    const updatedCourrier = await courrierService.updatePriority(
      req.params.id,
      priorite,
    );

    if (!updatedCourrier) {
      return res.status(404).json({ message: "Courrier introuvable" });
    }

    res.json(await addPdfUrl(updatedCourrier));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
