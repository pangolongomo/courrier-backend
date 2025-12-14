const origineService = require("../services/origine.service");

exports.getOrigines = async (req, res) => {
  try {
    const data = await origineService.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", err });
  }
};

exports.createOrigine = async (req, res) => {
  try {
    const { libelle } = req.body;
    if (!libelle) return res.status(400).json({ message: "Libelle requis" });

    const data = await origineService.findOrCreate(libelle);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de l'ajout", err });
  }
};

exports.updateOrigine = async (req, res) => {
  try {
    const { id } = req.params;
    const { libelle } = req.body;
    if (!libelle) return res.status(400).json({ message: "Libelle requis" });

    const data = await origineService.update(id, libelle);
    res.json(data);
  } catch (err) {
    if (err.message === "Origine non trouvée") {
      return res.status(404).json({ message: err.message });
    }
    if (err.message === "L'origine existe déjà") {
      return res.status(409).json({ message: err.message });
    }
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour", error: err.message });
  }
};
