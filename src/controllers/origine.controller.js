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
