const db = require("../config/db");

// GET all prospects
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM prospects ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur récupération prospects" });
  }
};

// CREATE a new prospect
exports.create = async (req, res) => {
  try {
    const {
      id,
      nom,
      telephone,
      typeEngin,
      dateDebut,
      dateFin,
      lieu,
      details,
    } = req.body;

    await db.query(
      "INSERT INTO prospects (id, nom, telephone, typeEngin, dateDebut, dateFin, lieu, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, nom, telephone, typeEngin, dateDebut, dateFin, lieu, details]
    );

    res.status(201).json({ message: "Prospect ajouté !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur création prospect" });
  }
};

// DELETE a prospect
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM prospects WHERE id = ?", [id]);
    res.json({ message: "Prospect supprimé !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur suppression prospect" });
  }
};
