const db = require("../config/db");

// Récupérer toutes les équipes
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM equipes");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur équipes" });
  }
};
