const db = require("../config/db");

// GET all prospects
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM prospects ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Erreur getAll:", err);
    res.status(500).json({ error: "Erreur serveur récupération prospects" });
  }
};

// CREATE a new prospect
exports.create = async (req, res) => {
  try {
    const {
      id,
      nomComplet,
      telephone,
      type_engin,
      date_debut,
      date_fin,
      lieu,
      details,
      prospect_id,
      equipe_id,
      cc_id,
    } = req.body;

    // Correction : 11 colonnes = 11 points d'interrogation et 11 variables
    const query = `
      INSERT INTO prospects 
      (id, nomComplet, telephone, type_engin, date_debut, date_fin, lieu, details, prospect_id, equipe_id, cc_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      id, 
      nomComplet, 
      telephone, 
      type_engin, 
      date_debut, 
      date_fin, 
      lieu, 
      details, 
      prospect_id || null, 
      equipe_id || null, 
      cc_id || null
    ];

    await db.query(query, values);

    res.status(201).json({ message: "Prospect ajouté !" });
  } catch (err) {
    console.error("Erreur create:", err);
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
    console.error("Erreur delete:", err);
    res.status(500).json({ error: "Erreur serveur suppression prospect" });
  }
};