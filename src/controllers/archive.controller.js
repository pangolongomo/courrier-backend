const ArchiveService = require("../services/archive.service");


const addPdfUrlArchive = (archive) => ({
  ...archive,
  courrier: {
    ...archive.courrier,
    pdfUrl: archive.courrier?.fichier_joint || null,
  },
});

class ArchiveController {
 
  static async getArchivedCourriers(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        categorie,
        origineId,
        archivedById,
        search,
      } = req.query;

      const data = await ArchiveService.getArchivedCourriers({
        page: Number(page),
        limit: Number(limit),
        categorie,
        origineId,
        archivedById,
        search,
      });

      
      const rowsWithPdfUrl = data.rows.map(addPdfUrlArchive);

      res.status(200).json({
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
        rows: rowsWithPdfUrl,
      });
    } catch (error) {
      console.error("Archive error:", error);
      res.status(500).json({
        message: "Erreur lors de la récupération des courriers archivés",
      });
    }
  }
}

module.exports = ArchiveController;
