const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Crée le dossier uploads s'il n'existe pas
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuration de stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // dossier de stockage
  },
  filename: (req, file, cb) => {
    // Nom unique : timestamp + extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filtrage : accepter seulement les fichiers PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Seuls les fichiers PDF sont autorisés"), false);
  }
};

// Export du middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5 Mo
});

module.exports = upload;
